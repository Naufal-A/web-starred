import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import MenuItem from '#models/menu_item'

export default class WishlistItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sessionId: string 

  @column()
  declare menuItemId: number

  @belongsTo(() => MenuItem)
  declare menuItem: BelongsTo<typeof MenuItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}