import { Parser, type ColumnRef } from 'node-sql-parser'
import { orderBy } from 'lodash'

import type { AST, Use, Select, From, Column } from 'node-sql-parser'
import { getDatabaseInstance } from '../databaseInstance'

const parser = new Parser()

export type SelectResponse = {
  type: 'select_response'
  columns: string[]
  rows: Record<string, unknown>[]
}

// AST Utils
export const isUse = (ast: AST): ast is Use => ast.type === 'use'
export const isSelect = (ast: AST): ast is Select => ast.type === 'select'
export const isFrom = (node: unknown): node is From => typeof node === 'object' && node !== null && 'table' in node
export const isColumnRef = (node: unknown): node is ColumnRef =>
  typeof node === 'object' && node !== null && 'type' in node && (node as { type: unknown }).type === 'column_ref'

// SQL Select
const getValue = (element: Record<string, any>, accessor: any): any => {
  if (isColumnRef(accessor)) {
    const { table, column } = accessor as ColumnRef
    if (table != null) {
      throw new Error('Table accessor is not supported')
    }
    if (column in element) {
      return element[column]
    } else {
      throw new Error(`Column ${column} not found in element`)
    }
  } else if (accessor.type === 'number' || accessor.type === 'single_quote_string') {
    return accessor.value
  } else if (accessor.type === 'binary_expr') {
    return executeBinaryExpression(element, accessor.left, accessor.right, accessor.operator)
  }
  console.log('ERR', accessor)
  throw new Error(`Invalid accessor ${accessor.type}`)
}
const executeBinaryExpression = (element: Record<string, any>, left: any, right: any, operator: string): boolean => {
  if (operator === '=') {
    return getValue(element, left) === getValue(element, right)
  }
  if (operator === '>') {
    return getValue(element, left) > getValue(element, right)
  }
  if (operator === '<') {
    return getValue(element, left) < getValue(element, right)
  }
  if (operator === '>=') {
    return getValue(element, left) >= getValue(element, right)
  }
  if (operator === '<=') {
    return getValue(element, left) <= getValue(element, right)
  }
  if (operator === '!=' || operator === '<>') {
    return getValue(element, left) !== getValue(element, right)
  }
  if (operator === 'LIKE') {
    const lVal = getValue(element, left)
    const rVal = getValue(element, right)
    if (typeof lVal !== 'string' || typeof rVal !== 'string') {
      throw new Error('LIKE operator only works with strings')
    }

    if (rVal.startsWith('%') && rVal.endsWith('%')) {
      return lVal.toLowerCase().includes(rVal.toLowerCase().slice(1, -1))
    } else if (rVal.startsWith('%')) {
      return lVal.toLowerCase().endsWith(rVal.toLowerCase().slice(1))
    } else if (rVal.endsWith('%')) {
      return lVal.toLowerCase().startsWith(rVal.toLowerCase().slice(0, -1))
    } else {
      return lVal.toLowerCase() === rVal.toLowerCase()
    }
  }
  if (operator === 'AND') {
    return getValue(element, left) && getValue(element, right)
  }
  if (operator === 'OR') {
    return getValue(element, left) || getValue(element, right)
  }
  throw new Error(`Operator ${operator} not supported`)
}
const applyFilter = (element: any, filter: any): boolean => {
  if (typeof filter !== 'object' || filter == null) {
    throw new Error('Filter must be an object')
  }
  if (typeof element !== 'object' || element == null) {
    throw new Error('Element must be an object')
  }

  if (filter.type !== 'binary_expr') {
    throw new Error('Filter must be a binary expression')
  }

  const { left, right, operator } = filter

  return executeBinaryExpression(element, left, right, operator)
}

export const executeSqlSelect = async (statement: Select, db?: string | null): Promise<SelectResponse> => {
  if (statement.with != null) {
    throw new Error('WITH is not supported in SELECT queries')
  }
  if (statement.options != null) {
    throw new Error('OPTIONS are not supported in SELECT queries')
  }
  if (statement.distinct != null) {
    throw new Error('DISTINCT is not supported in SELECT queries')
  }
  if (statement.groupby != null) {
    throw new Error('GROUP BY is not supported in SELECT queries')
  }
  if (statement.having != null) {
    throw new Error('HAVING is not supported in SELECT queries')
  }

  const fromList = statement.from
  if (fromList == null) {
    throw new Error('FROM is required in SELECT queries')
  }
  if (fromList.length !== 1) {
    throw new Error('Only one table is supported in SELECT queries')
  }
  const from = fromList[0]
  if (!isFrom(from)) {
    throw new Error('Only tables are supported as from targets in SELECT queries')
  }

  const dbToQuery = from.db ?? db
  if (!dbToQuery) {
    throw new Error('No database selected')
  }

  const instance = await getDatabaseInstance(dbToQuery)
  let collection = instance.table(from.table).toCollection()

  if (statement.where != null) {
    // This is a slow implementation but it's fast enough for POC
    collection = collection.filter(element => {
      return applyFilter(element, statement.where)
    })
  }

  let data = await collection.toArray()

  if (statement.orderby != null) {
    if (statement.orderby.length !== 1) {
      throw new Error('Only one order by is supported in SELECT queries')
    }
    const orderByNode = statement.orderby[0]
    if (orderByNode.expr.type !== 'column_ref') {
      throw new Error('Only column references are supported in order by')
    }
    const column = orderByNode.expr.column
    data = orderBy(data, [column], [orderByNode.type.toLowerCase() as 'asc' | 'desc'])
  }

  if (statement.limit != null) {
    if (statement.limit.value.length === 1) {
      data = data.slice(0, statement.limit.value[0].value)
    } else if (statement.limit.value.length === 2) {
      // Looks like there's a typo in the parser lol, should be separator :D
      if (statement.limit.seperator !== ',') {
        throw new Error('Only comma is supported as limit separator')
      }

      data = data.slice(statement.limit.value[0].value, statement.limit.value[1].value)
    } else {
      throw new Error('Only 1 or 2 limit values are supported')
    }
  }

  if (data.length === 0) {
    return {
      type: 'select_response',
      columns: [],
      rows: [],
    }
  }

  if (statement.columns === '*') {
    return {
      type: 'select_response',
      columns: Object.keys(data[0]),
      rows: data,
    }
  } else {
    return {
      type: 'select_response',
      columns: statement.columns.map(column => {
        if (column.as) {
          throw new Error('AS is not supported in SELECT queries')
        }
        return column.expr.column
      }),
      rows: data.map(row =>
        (statement.columns as Column[]).reduce((acc, column) => {
          if (!isColumnRef(column.expr)) {
            throw new Error('Only column references are supported in SELECT queries')
          }
          const columnRef = column.expr as ColumnRef
          if (columnRef.table != null) {
            throw new Error('Table references are not supported in SELECT queries')
          }

          return { ...acc, [columnRef.column]: row[columnRef.column] }
        }, {}),
      ),
    }
  }
}

// Generic SQL Execution
export const executeSql = async (query: string) => {
  const parsed = parser.astify(query)

  if (parsed == null) {
    throw new Error('Query cannot be empty')
  }

  let statementToExecute: AST = Array.isArray(parsed) ? parsed[1] : parsed
  let usedDb: string | null = null

  if (Array.isArray(parsed)) {
    if (parsed.length === 2 && isUse(parsed[0])) {
      usedDb = parsed[0].db
    } else if (parsed.length === 1) {
      statementToExecute = parsed[0]
    } else {
      console.log(parsed)
      throw new Error('Multiple queries are not supported')
    }
  }

  if (isSelect(statementToExecute)) {
    return executeSqlSelect(statementToExecute, usedDb)
  }

  throw new Error(`Unsupported query type ${statementToExecute.type}`)
}

// SQL Execution composable
export const useSqlExecution = () => executeSql
