import { promiseWIthProgress } from '@/utils/promiseWithProgress'
import Dexie from 'dexie'
import { getRootIstance } from '../rootDatabase'
import type { Template } from '../types'
import { buildSchemaForDatabase } from '../utils'

export const useRootDatabase = () => {
  const instance = getRootIstance()

  const createDatabase = promiseWIthProgress(
    async (setProgress: (progress: number) => void, name: string, template?: Template) => {
      await instance.databases.add({ name, version: 1 })

      if (template) {
        await Promise.all(
          template.tables.map(async table => {
            await instance.dbTables.add({ name: table.name, databaseName: name })

            await Promise.all(
              table.columns.map(async column => {
                await instance.columns.add({ ...column, tableName: table.name })
              }),
            )
          }),
        )

        if (template.fakeData) {
          const schema = await buildSchemaForDatabase(name)
          const db = new Dexie(name)
          db.version(1).stores(schema)
          await template.fakeData(setProgress, db)
        }
      }
    },
  )

  return { createDatabase, instance }
}
