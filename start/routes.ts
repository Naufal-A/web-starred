// File: start/routes.ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const MenuItemController = () => import('#controllers/menu_items_controller')
const WishlistController = () => import('#controllers/wishlists_controller')

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
    
    // --- RUTE WISHLIST ---
    router.get('/wishlist', [WishlistController, 'index']).as('wishlist.index')
    // Ubah rute 'wishlist' yang lama menjadi ini ^

    // Rute untuk menambah item (gunakan POST)
    // Kita ambil menuItemId dari parameter URL
    router.post('/wishlist/:menuItemId', [WishlistController, 'store']).as('wishlist.store')

    // Rute untuk menghapus item (gunakan DELETE)
    router.delete('/wishlist/:id', [WishlistController, 'destroy']).as('wishlist.destroy')
    // --- AKHIR RUTE WISHLIST ---
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
    router.get('/wishlist', [WishlistController, 'index']).as('admin.wishlist')
  })
  .prefix('/admin')
  .use(middleware.admin()) 