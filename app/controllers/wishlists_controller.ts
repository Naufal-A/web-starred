import type { HttpContext } from '@adonisjs/core/http'
import WishlistItem from '#models/wishlist_item'
import MenuItem from '#models/menu_item' // Import MenuItem

export default class WishlistController {
  /**
   * Menampilkan item wishlist
   * - Untuk user biasa: hanya item milik sesi saat ini
   * - Untuk admin: semua item wishlist
   */
  async index({ view, session, request }: HttpContext) {
    const user = session.get('loggedInUser') 
    const isAdmin = user && user.role === 'admin'
    const sessionId = session.sessionId

    let wishlistItemsQuery = WishlistItem.query()
                                        .preload('menuItem') 
                                        .orderBy('createdAt', 'desc')

    if (isAdmin) {
    } else if (sessionId) {
      wishlistItemsQuery = wishlistItemsQuery.where('sessionId', sessionId)
    } else {
      wishlistItemsQuery = wishlistItemsQuery.whereRaw('1 = 0') 
    }

    const wishlistItems = await wishlistItemsQuery

    // Tentukan view mana yang akan dirender berdasarkan URL
    if (request.url().startsWith('/admin')) {
      return view.render('pages/admin/wishlist', { wishlistItems }) 
    } else {
      return view.render('pages/user/wishlist', { wishlistItems }) 
    }
  }

  /**
   * Menyimpan item baru ke wishlist
   */
  async store({ params, response, session, request }: HttpContext) {
    const sessionId = session.sessionId
    const menuItemId = params.menuItemId || request.input('menu_item_id')

    if (!sessionId || !menuItemId) {
      session.flash('error', 'Gagal menambahkan ke wishlist: Informasi tidak lengkap.')
      return response.redirect().back()
    }
    const menuItem = await MenuItem.find(menuItemId)
    if (!menuItem) {
        session.flash('error', 'Gagal menambahkan ke wishlist: Item menu tidak ditemukan.')
        return response.redirect().back()
    }

    try {
      // Cek apakah item sudah ada di wishlist sesi ini
      const existingItem = await WishlistItem.query()
        .where('sessionId', sessionId)
        .where('menuItemId', menuItemId)
        .first()

      if (existingItem) {
        session.flash('info', `${menuItem.name} sudah ada di wishlist Anda.`)
      } else {
        // Buat item wishlist baru
        await WishlistItem.create({
          sessionId: sessionId,
          menuItemId: menuItemId,
        })
        session.flash('success', `${menuItem.name} berhasil ditambahkan ke wishlist!`)
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      session.flash('error', 'Terjadi kesalahan saat menambahkan ke wishlist.')
    }
    return response.redirect().back()
  }

  /**
   * Menghapus item dari wishlist
   */
  async destroy({ params, response, session }: HttpContext) {
    const sessionId = session.sessionId
    const wishlistItemId = params.id

    if (!sessionId) {
        session.flash('error', 'Sesi tidak ditemukan.')
        return response.redirect().back()
    }

    try {
      const wishlistItem = await WishlistItem.query()
        .where('id', wishlistItemId)
        .where('sessionId', sessionId) 
        .firstOrFail() 

      await wishlistItem.delete()
      session.flash('success', 'Item berhasil dihapus dari wishlist.')
    } catch (error) {
       console.error('Error removing from wishlist:', error)
      
      session.flash('error', 'Gagal menghapus item dari wishlist.')
    }

    
    return response.redirect().toRoute('wishlist.index')
  }
}