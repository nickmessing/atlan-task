<script setup lang="ts">
import SQLEditor from '@/components/sql/SQLEditor.vue'
import { getDatabases, getTables, useSqlExecution, type SelectResponse } from '@/db'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SelectResults from '../components/sql/SelectResults.vue'

const execute = useSqlExecution()

const route = useRoute()

let initialValue = ''
if (route.query.sql) {
  initialValue = route.query.sql as string
} else {
  const databases = await getDatabases()
  const tables = await getTables(databases[0].name)

  initialValue = `SELECT * FROM \`${databases[0].name}\`.\`${tables[0].name}\` LIMIT 0, 10;`
}

const loading = ref(false)
const sql = ref(initialValue)
const errorMessage = ref('')
const result = ref<SelectResponse>({
  type: 'select_response',
  columns: [],
  rows: [],
})

watch(
  () => route.query.sql,
  value => {
    if (value) {
      sql.value = value as string
      executeSqlQuery()
    }
  },
)
watch(sql, () => {
  if (errorMessage.value) errorMessage.value = ''
})

const executeSqlQuery = async () => {
  loading.value = true
  try {
    result.value = await execute(sql.value)
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Unknown error'
    console.log(e)
  }
  loading.value = false
}

onMounted(() => executeSqlQuery())
</script>

<template>
  <div class="home-page">
    <SQLEditor
      v-model="sql"
      class="sql-editor"
      :class="{ grow: !result }"
      :errorMessage="errorMessage"
      @execute="executeSqlQuery"
    />
    <div class="results">
      <SelectResults :data="result" :loading="loading" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .sql-editor {
    &:not(.grow) {
      height: 300px;
      flex-shrink: 0;
    }
    &.grow {
      flex-grow: 1;
    }
  }

  .results {
    flex-grow: 1;
    min-height: 0;
    min-width: 0;
    overflow: auto;
    padding: 1rem;
    border-top: 1px solid var(--color-dark-gray-gray-100);
  }
}
</style>
