// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  private users: Record<string, { password: string; role: string }> = {
    'admin@carrera.com': { password: 'adminpassword', role: 'admin' },
    'user@carrera.com': { password: 'userpassword', role: 'user' },
  }

  public showLogin({ view }: HttpContext) {
    return view.render('pages/login')
  }

  public async handleLogin({ request, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = this.users[email]

    if (user && user.password === password) {
      session.put('loggedInUser', { email: email, role: user.role })

      // Arahkan berdasarkan peran (role)
      if (user.role === 'admin') {
        return response.redirect('/admin/dashboard')
      }

      // --- INI PERUBAHANNYA ---
      // Arahkan user biasa ke halaman '/home'
      return response.redirect('/home')
    }

    session.flash('error', 'Email atau password salah.')
    return response.redirect().back()
  }
  public async logout({ response, session }: HttpContext) {
    session.forget('loggedInUser') // Hapus data dari session
    return response.redirect('/login')
  }
}
