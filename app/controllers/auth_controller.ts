import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  private users: Record<string, { password: string; role: string }> = {
    admin: { password: 'password', role: 'admin' },
    user: { password: 'password', role: 'user' },
  }

  public showLogin({ view }: HttpContext) {
    return view.render('pages/shared/login')
  }

  public async handleLogin({ request, response, session }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    const user = this.users[username]

    if (user && user.password === password) {
      session.put('loggedInUser', {
        username: username,
        role: user.role,
      })

      if (user.role === 'admin') {
        return response.redirect('/admin/dashboard')
      }
      return response.redirect('/user/home')
    }

    session.flash('error', 'Username atau password salah.')
    return response.redirect().back()
  }

  public async logout({ response, session }: HttpContext) {
    session.forget('loggedInUser')
    return response.redirect('/login')
  }
}
