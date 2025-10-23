import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import WishlistItem from '#models/wishlist_item' 
import type { HasMany } from '@adonisjs/lucid/types/relations' 
import { hasMany } from '@adonisjs/lucid/orm' 

export default class MenuItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare price: number 

  @column()
  declare category: string

  @column()
  declare imageUrl: string | null 

  @hasMany(() => WishlistItem)
  declare wishlistItems: HasMany<typeof WishlistItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
