import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminAuthMiddleware {
  async handle({ session, response }: HttpContext, next: NextFn) {
    const user = session.get('loggedInUser')

    // Jika tidak ada user di session ATAU perannya bukan 'bendahara'
    if (!user || user.role !== 'admin') {
      // Alihkan ke halaman utama
      return response.redirect('/')
    }

    // Jika user adalah bendahara, izinkan lanjut
    await next()
  }
}
