<script setup lang="ts">
import { useRouter } from 'vue-router'

import Wizard from '@/components/wizard/Wizard.vue'

const router = useRouter()
</script>

<template>
  <Wizard @finish="router.push('/')" />
</template>
