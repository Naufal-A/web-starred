// import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {// File: app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  // Data pengguna statis untuk uji coba
  private users = {
    'bendahara@carrera.com': { password: 'adminpassword', role: 'bendahara' },
    'user@carrera.com': { password: 'userpassword', role: 'user' },
  }

  // Menampilkan halaman login
  public showLogin({ view }: HttpContext) {
    return view.render('pages/login')
  }

  // Memproses data dari form login
  public async handleLogin({ request, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = this.users[email]

    // Cek apakah user ada dan password-nya cocok
    if (user && user.password === password) {
      // Jika cocok, simpan info user ke session
      session.put('loggedInUser', {
        email: email,
        role: user.role,
      })

      // Arahkan berdasarkan peran (role)
      if (user.role === 'bendahara') {
        return response.redirect('/bendahara/dashboard')
      }
      return response.redirect('/')
    }

    // Jika gagal, kembali ke halaman login dengan pesan error
    session.flash('error', 'Email atau password salah.')
    return response.redirect().back()
  }

  // Proses Logout
  public async logout({ response, session }: HttpContext) {
    session.forget('loggedInUser') // Hapus data dari session
    return response.redirect('/login')
  }
}
}