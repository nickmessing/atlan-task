import { Dexie } from 'dexie'
import { buildSchemaForDatabase, getDatabases } from './utils'

const cachedInstances = new Map<string, Dexie>()

export const clearCachedInstance = (databaseName: string) => {
  cachedInstances.delete(databaseName)
}

export const getDatabaseInstance = async (databaseName: string) => {
  const cachedInstance = cachedInstances.get(databaseName)
  if (cachedInstance) return cachedInstance

  const databases = await getDatabases()
  const targetDatabase = databases.find(database => database.name === databaseName)

  if (targetDatabase == null) {
    throw new Error(`Database ${databaseName} not found`)
  }

  const db = new Dexie(targetDatabase.name)
  const schema = await buildSchemaForDatabase(databaseName)
  db.version(targetDatabase.version).stores(schema)
  cachedInstances.set(databaseName, db)
  return db
}
