import type Dexie from 'dexie'

export const FieldType = {
  String: 'String',
  Number: 'Number',
  Boolean: 'Boolean',
  Date: 'Date',
} as const
export type FieldType = typeof FieldType[keyof typeof FieldType]

export type ValueFromFieldType<T extends FieldType> = T extends typeof FieldType.String
  ? string
  : T extends typeof FieldType.Number
  ? number
  : T extends typeof FieldType.Boolean
  ? boolean
  : T extends typeof FieldType.Date
  ? Date
  : never

export type Database = {
  id?: number
  name: string
  version: number
}

export type Table = {
  id?: number
  name: string
  databaseName: string
}

export type Column = {
  id?: number
  name: string
  tableName: string
  unique?: boolean
  type: FieldType
  autoIncrement?: boolean
}

export type MappedTable = Omit<Table, 'databaseName'> & {
  columns: Omit<Column, 'tableName'>[]
}

export type MappedDatabase = Omit<Database, 'version'> & {
  tables: MappedTable[]
}

export type Template = {
  id: string
  name: string
  description: string
  tables: MappedTable[]
  fakeData?: (setProgress: (progress: number) => void, dexieInstance: Dexie) => Promise<void>
}
