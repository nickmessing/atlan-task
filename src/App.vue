<script setup lang="ts">
import Wizard from '@/components/wizard/Wizard.vue'
import { ref } from 'vue'
import { getDatabases } from './db'

import MainLayout from './layout/MainLayout.vue'

const databases = await getDatabases()

const isWizardVisible = ref(databases.length === 0)
</script>

<template>
  <Wizard v-if="isWizardVisible" @finish="isWizardVisible = false" />
  <MainLayout v-else />
</template>
