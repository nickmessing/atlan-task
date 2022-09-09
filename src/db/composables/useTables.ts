import { getTables, useReactiveQuery } from '../utils'

export const useTables = (databaseName: string) => useReactiveQuery(() => getTables(databaseName), [])
