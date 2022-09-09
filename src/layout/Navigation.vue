<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { useDatabases } from '@/db'
import DatabaseNavigation from './DatabaseNavigation.vue'
import IconEdit from '../components/icons/IconEdit.vue'
import IconPlus from '../components/icons/IconPlus.vue'

const databases = useDatabases()
</script>

<template>
  <nav class="navigation">
    <RouterLink to="/" class="link">
      <IconEdit />
      SQL Editor
    </RouterLink>
    <DatabaseNavigation v-for="database in databases" :key="database.id" :databaseName="database.name" />
    <RouterLink to="/db/new" class="link">
      <IconPlus />
      Create new database
    </RouterLink>
  </nav>
</template>

<style lang="scss" scoped>
.navigation {
  width: 300px;
  border-right: 1px solid var(--color-dark-gray-gray-100);
  padding: 1rem;
  overflow: auto;
  flex-shrink: 0;

  .link {
    display: block;
    height: 56px;
    text-decoration: none;
    color: var(--color-dark-white-white-100);
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 0.25rem;
    font-weight: 500;

    &:hover,
    &.router-link-active {
      background: var(--color-dark-gray-gray-100);
    }

    > svg {
      margin-right: 1rem;
    }
  }
}
</style>
