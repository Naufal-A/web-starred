import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthSessionMiddleware {
  async handle({ session, response }: HttpContext, next: NextFn) {
    // Cek apakah ada data 'loggedInUser' di session
    if (!session.get('loggedInUser')) {
      // Jika tidak ada, paksa redirect ke halaman login
      return response.redirect('/login')
    }

    // Jika ada, izinkan akses
    await next()
  }
}
