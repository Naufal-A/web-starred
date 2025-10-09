// app/middleware/bendahara_auth_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class BendaharaAuthMiddleware {
  async handle({ session, response }: HttpContext, next: NextFn) {
    const user = session.get('loggedInUser')

    // Jika tidak ada user di session atau perannya bukan bendahara
    if (!user || user.role !== 'bendahara') {
      // Tendang ke halaman utama
      return response.redirect('/')
    }

    // Izinkan akses
    await next()
  }
}
