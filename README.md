# atlan-task

Task for Atlan interview

## Overview

This application allows you to create, seed & see data using a subset of MySQL compatible SQL queries.
It actually seeds a real-looking database in your browser using IndexedDB.
Only supports `SELECT` queries. I planned to add `UPDATE`, `INSERT` and `DELETE` but I timeboxed the task to 16 hours and this is where I got.

## Framework & Libraries

- [vue v3.2.38](https://www.npmjs.com/package/vue/v/3.2.38) - Rendering of the UI & Reactivity system
  - [vue-router v4.1.5](https://www.npmjs.com/package/vue-router/v/4.1.5) - Routing system
  - [@vueuse/core v9.2.0](https://www.npmjs.com/package/@vueuse/core/v/9.2.0) - Utility composables
  - [vue-prism-editor v2.0.0-alpha.2](https://www.npmjs.com/package/vue-prism-editor/v/2.0.0-alpha.2) - Prism.js wrapper
    - [prismjs v1.29.0](https://www.npmjs.com/package/prismjs/v/1.29.0) - Prism.js code editor
  - [vue-virtual-scroller v2.0.0-alpha.1](https://www.npmjs.com/package/vue-virtual-scroller/v/2.0.0-alpha.1) - Virtual scroll implementation
- [dexie v3.2.2](https://www.npmjs.com/package/dexie/v/3.2.2) - IndexedDB Wrapper
- [@faker-js/faker v7.5.0](https://www.npmjs.com/package/@faker-js/faker/v/7.5.0) - Fake data to seed the databases
- [lodash v4.17.21](https://www.npmjs.com/package/lodash/v/4.17.21) - Utility collection (used only for array sorting)
- [node-sql-parser v4.5.0](https://www.npmjs.com/package/node-sql-parser/v/4.5.0) - AST parser for SQL

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) for amazing development exeprience.

## Performance & Optimization

I have not tested the performance in any way, I only optimize if-needed and in this particular POC there were performance issues with big data tables and I used virtualized-list to reduce number of DOM nodes rendered which resulted in "snappy" feeling performance across the board. No other performance issues were noticed.

## Project Setup

```sh

pnpm install

```

### Compile and Hot-Reload for Development

```sh

pnpm dev

```

### Type-Check, Compile and Minify for Production

```sh

pnpm build

```

### Lint with [ESLint](https://eslint.org/)

```sh

pnpm lint

```
