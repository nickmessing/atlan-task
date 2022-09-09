import { getDatabases, useReactiveQuery } from '../utils'

export const useDatabases = () => useReactiveQuery(getDatabases, [])
