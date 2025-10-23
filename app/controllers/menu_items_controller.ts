import type { HttpContext } from '@adonisjs/core/http'
import MenuItem from '#models/menu_item'
import vine from '@vinejs/vine'

export default class MenuItemController {
  /**
   * Display a list of resource
   */
  // Tambahkan 'request' ke parameter
  async index({ view, request }: HttpContext) {
    const menuItems = await MenuItem.all()
    // Kelompokkan item berdasarkan kategori
    const groupedItems = menuItems.reduce((acc, item) => {
      const category = item.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {} as Record<string, MenuItem[]>)

    // Render view user menu
    // Gunakan request.url() langsung
    if (request.url().startsWith('/user')) {
       return view.render('pages/user/menu', { groupedItems })
    }
    // Render view admin menu (dengan form tambah)
    // Gunakan request.url() langsung
    else if (request.url().startsWith('/admin')) {
       return view.render('pages/admin/menu', { groupedItems })
    }
    // Handle case lain jika perlu
    return "Invalid route context";
  }

  /**
   * Handle form submission for the creation action
   */
   async store({ request, response, session }: HttpContext) {
    const data = request.all()

    // Validasi input
    const validator = vine.compile(
      vine.object({
        name: vine.string().trim().minLength(3),
        price: vine.number().positive(),
        // Ganti vine.string()...isIn menjadi vine.enum
        category: vine.enum(['Coffe', 'Snack', 'Non-Coffe']), // Sesuaikan kategori jika perlu
        description: vine.string().trim().optional(),
        // Ganti nama field ke camelCase agar sesuai model
        imageUrl: vine.string().trim().url().optional(),
      })
    )

    try {
      const payload = await validator.validate(data)
      await MenuItem.create(payload)
      session.flash('success', 'Item menu berhasil ditambahkan!')
    } catch (error) {
       console.error("Validation or Creation Error:", error);
       session.flash('error', 'Gagal menambahkan item menu. Periksa kembali input Anda.')
       // Cek apakah error memiliki properti messages (untuk error validasi VineJS)
       if (error && typeof error === 'object' && 'messages' in error) {
         session.flash('errors', error.messages);
       }
    }

    return response.redirect().back()
  }

  // Metode lain (show, edit, update, destroy) bisa ditambahkan nanti jika diperlukan
}