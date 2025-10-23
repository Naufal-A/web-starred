// File: start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')

// --- RUTE PUBLIK (LOGIN) ---
// Sekarang rute utama "/" adalah halaman login
router.get('/', [AuthController, 'showLogin']).as('login.show')
router.get('/login', [AuthController, 'showLogin']) // Alias untuk /
router.post('/login', [AuthController, 'handleLogin']).as('login.handle')
router.post('/logout', [AuthController, 'logout']).as('logout')

// --- RUTE INTERNAL YANG DILINDUNGI (UNTUK USER BIASA) ---
router
  .group(() => {
    // Halaman Home lama sekarang ada di '/home'
    router.on('/home').render('pages/user/home').as('home')
    router.on('/menu').render('pages/user/menu').as('menu')
    router.on('/about').render('pages/user/about').as('about')
    router.on('wishlist').render('pages/user/wishlist').as('wishlist')
  })
  .prefix('/user')
  .use(middleware.authSession()) // Dilindungi oleh middleware baru kita

// --- RUTE KHUSUS BENDahara (TETAP SAMA) ---
router
  .group(() => {
    router.on('/dashboard').render('pages/admin/dashboard').as('admin.dashboard')
    router.on('/menu').render('pages/admin/menu').as('admin.menu')
    router.on('/wishlist').render('pages/admin/wishlist').as('admin.wishlist')
  })
  .prefix('/admin')
  .use(middleware.admin())
