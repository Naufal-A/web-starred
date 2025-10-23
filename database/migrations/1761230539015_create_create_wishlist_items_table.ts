// File: database/migrations/TIMESTAMP_create_wishlist_items_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'wishlist_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key

      // Kolom untuk user yang login (jika fitur login user sudah ada)
      // table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').nullable()

      // Kolom untuk session ID (jika user belum login)
      // Pastikan session ID cukup panjang
      table.string('session_id').notNullable().index()

      // Foreign key ke tabel menu_items
      table.integer('menu_item_id').unsigned().references('id').inTable('menu_items').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Pastikan kombinasi session_id dan menu_item_id unik
      // Atau kombinasi user_id dan menu_item_id jika pakai user login
      table.unique(['session_id', 'menu_item_id'])
      // table.unique(['user_id', 'menu_item_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}