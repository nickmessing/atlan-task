<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { useTables } from '@/db'
import IconPlus from '../components/icons/IconPlus.vue'

const props = defineProps<{
  databaseName: string
}>()

const tables = useTables(props.databaseName)
</script>

<template>
  <div class="database-navigation">
    <div class="database-name">
      {{ props.databaseName }}
    </div>
    <RouterLink
      v-for="table in tables"
      :key="table.id"
      :to="{ name: 'home', query: { sql: `SELECT * FROM \`${props.databaseName}\`.\`${table.name}\` LIMIT 0, 10;` } }"
      class="database-table-link"
    >
      {{ table.name }}
    </RouterLink>
    <div v-if="tables.length === 0">
      <div class="no-tables">No tables</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.database-navigation {
  margin: 1rem 0;

  .database-name {
    display: block;
    height: 56px;
    text-decoration: none;
    color: var(--color-dark-white-white-100);
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 1rem;
    font-weight: 500;
  }

  .no-tables {
    font-size: 14px;
    padding-left: 2rem;
    opacity: 30%;
  }

  .database-table-link {
    display: block;
    height: 56px;
    text-decoration: none;
    color: var(--color-dark-white-white-100);
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 1rem;
    margin-left: 1rem;

    &:hover {
      background: var(--color-dark-gray-gray-100);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-dark-gray-gray-100);
    }

    > svg {
      margin-right: 1rem;
    }
  }
}
</style>
