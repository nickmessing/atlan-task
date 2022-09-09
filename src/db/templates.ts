import { faker } from '@faker-js/faker'

import { FieldType, type Template } from './types'

export const templates: Template[] = [
  {
    name: 'Blog',
    id: 'blog',
    description: 'A simple blog with posts and comments',
    tables: [
      {
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: FieldType.Number,
            autoIncrement: true,
          },
          {
            name: 'title',
            type: FieldType.String,
          },
          {
            name: 'body',
            type: FieldType.String,
          },
        ],
      },
      {
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: FieldType.Number,
            autoIncrement: true,
          },
          {
            name: 'postId',
            type: FieldType.Number,
          },
          {
            name: 'name',
            type: FieldType.String,
          },
          {
            name: 'email',
            type: FieldType.String,
          },
          {
            name: 'body',
            type: FieldType.String,
          },
        ],
      },
    ],
    async fakeData(setProgress, instance) {
      const posts = instance.table('posts')
      const comments = instance.table('comments')
      const total = 1000
      for (let i = 0; i < total; i++) {
        const post = await posts.add({
          title: faker.lorem.sentence(),
          body: faker.lorem.paragraphs(),
        })
        await comments.bulkAdd(
          new Array(Math.floor(Math.random() * 100) + 1).fill(0).map(() => {
            const firstName = faker.name.firstName()
            const lastName = faker.name.lastName()

            return {
              postId: post,
              name: `${firstName} ${lastName}`,
              email: faker.internet.email(firstName, lastName),
              body: faker.lorem.paragraph(),
            }
          }),
        )
        setProgress((i + 1) / total)
      }
    },
  },
  {
    name: 'E-commerce',
    id: 'ecommerce',
    description: 'A simple e-commerce store with products and orders',
    tables: [
      {
        name: 'products',
        columns: [
          {
            name: 'id',
            type: FieldType.Number,
            autoIncrement: true,
          },
          {
            name: 'name',
            type: FieldType.String,
          },
          {
            name: 'price',
            type: FieldType.Number,
          },
          {
            name: 'description',
            type: FieldType.String,
          },
        ],
      },
      {
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: FieldType.Number,
            autoIncrement: true,
          },
          {
            name: 'productId',
            type: FieldType.Number,
          },
          {
            name: 'quantity',
            type: FieldType.Number,
          },
          {
            name: 'address',
            type: FieldType.String,
          },
        ],
      },
    ],
    async fakeData(setProgress, instance) {
      const products = instance.table('products')
      const orders = instance.table('orders')
      const total = 1000
      for (let i = 0; i < total; i++) {
        const product = await products.add({
          name: faker.commerce.productName(),
          price: faker.commerce.price(),
          description: faker.commerce.productDescription(),
        })
        await orders.bulkAdd(
          new Array(Math.floor(Math.random() * 100) + 1).fill(0).map(() => ({
            productId: product,
            quantity: Math.floor(Math.random() * 10) + 1,
            address: faker.address.streetAddress(),
          })),
        )
        setProgress((i + 1) / total)
      }
    },
  },
  {
    name: 'No Template',
    id: '',
    description: 'Start with an empty database',
    tables: [],
  },
]
