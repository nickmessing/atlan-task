import { promiseWIthProgress } from '@/utils/promiseWithProgress'
import Dexie from 'dexie'
import type { Column, Database, Table, Template } from './types'
import { useReactiveQuery } from './utils'

export class RootDatabase extends Dexie {
  databases!: Dexie.Table<Database, number>
  dbTables!: Dexie.Table<Table, number>
  columns!: Dexie.Table<Column, number>

  constructor() {
    super('__RootDatabase')

    this.version(1).stores({
      databases: '++id, name, version',
      dbTables: '++id, name, databaseName',
      columns: '++id, name, tableName, type',
    })
  }
}

let cachedInstance: RootDatabase | null = null
export const getRootIstance = () => cachedInstance ?? (cachedInstance = new RootDatabase())
