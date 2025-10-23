import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Primary key
      table.string('name').notNullable() // Nama item menu
      table.text('description').nullable() // Deskripsi item
      table.decimal('price').notNullable() // Harga item
      table.string('category').notNullable() // Kategori (misal: 'Coffe', 'Snack', 'Non-Coffe')
      table.string('image_url').nullable() // URL gambar item
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
