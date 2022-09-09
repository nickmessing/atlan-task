import { liveQuery } from 'dexie'
import { ref, type Ref, type UnwrapRef } from 'vue'
import { getRootIstance } from './rootDatabase'

export function useReactiveQuery<T>(query: () => Promise<T>, defaultValue: T): Ref<UnwrapRef<T>>
export function useReactiveQuery<T>(query: () => Promise<T>, defaultValue: null): Ref<UnwrapRef<T | null>>
export function useReactiveQuery<T>(query: () => Promise<T>, defaultValue: T | null) {
  const data = ref<T | null>(defaultValue)
  const observer = liveQuery(query)
  observer.subscribe(value => (data.value = value as UnwrapRef<T>))
  return data
}

export const getDatabases = () => getRootIstance().databases.toArray()
export const getTables = (databaseName: string) =>
  getRootIstance().dbTables.where('databaseName').equals(databaseName).toArray()

export const buildSchemaForDatabase = async (databaseName: string) => {
  const tables = await getTables(databaseName)

  const mappedTables = await Promise.all(
    tables.map(async table => ({
      table,
      columns: await getRootIstance().columns.where('tableName').equals(table.name).toArray(),
    })),
  )

  return mappedTables.reduce<{ [key: string]: string }>(
    (schema, { table, columns }) => ({
      ...schema,
      [table.name]: columns
        .map(column => `${column.autoIncrement ? '++' : column.unique ? '&' : ''}${column.name}`)
        .join(', '),
    }),
    {},
  )
}
