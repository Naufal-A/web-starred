// File: start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const MenuItemController = () => import('#controllers/menu_items_controller')

// --- RUTE PUBLIK (LOGIN) ---
router.get('/', [AuthController, 'showLogin']).as('login.show')
router.get('/login', [AuthController, 'showLogin']) // Alias untuk /
router.post('/login', [AuthController, 'handleLogin']).as('login.handle')
router.post('/logout', [AuthController, 'logout']).as('logout')

// --- RUTE INTERNAL YANG DILINDUNGI (UNTUK USER BIASA) ---
router
  .group(() => {
    router.on('/home').render('pages/user/home').as('home')
    // Ubah rute menu user
    router.get('/menu', [MenuItemController, 'index']).as('menu')
    router.on('/about').render('pages/user/about').as('about')
    router.on('wishlist').render('pages/user/wishlist').as('wishlist')
  })
  .prefix('/user')
  .use(middleware.authSession())

// --- RUTE KHUSUS ADMIN ---
router
  .group(() => {
    router.on('/dashboard').render('pages/admin/dashboard').as('admin.dashboard')
    // Ubah rute menu admin
    router.get('/menu', [MenuItemController, 'index']).as('admin.menu')
    // Tambah rute POST untuk menyimpan item menu baru
    router.post('/menu', [MenuItemController, 'store']).as('admin.menu.store')
    router.on('/wishlist').render('pages/admin/wishlist').as('admin.wishlist')
  })
  .prefix('/admin')
  .use(middleware.admin()) // Pastikan ini melindungi semua rute admin