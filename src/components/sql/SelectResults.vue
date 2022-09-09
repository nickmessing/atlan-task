<script setup lang="ts">
// @ts-ignore
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import type { SelectResponse } from '@/db'

const props = defineProps<{
  data: SelectResponse
  loading?: boolean
}>()
</script>

<template>
  <div class="results-table">
    <div class="header">
      <div v-for="column in props.data.columns" class="heading">
        {{ column }}
      </div>
    </div>

    <RecycleScroller class="body" :items="props.data.rows" :item-size="38" v-slot="{ item }">
      <div class="row">
        <div v-for="column in props.data.columns" class="cell">
          {{ item[column] }}
        </div>
      </div>
    </RecycleScroller>

    <Transition name="quick-fade">
      <div class="loading" v-if="props.loading">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.results-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  .loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid var(--color-dark-gray-gray-80);

    .heading {
      padding: 0.5rem 1rem;
      font-weight: bold;
      width: 300px;
      text-align: center;
    }
  }

  .body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .row {
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid var(--color-dark-gray-gray-80);
      height: 38px;

      .cell {
        padding: 0.5rem 1rem;
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);

    &:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }

    &:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }

    &:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }

    &:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
  }
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
