// File: start/routes.ts
import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel' // <-- Import ini sekarang akan berfungsi

/*
| --------------------------------------------------------------------------
| Hapus blok ini dari routes.ts
| --------------------------------------------------------------------------
|
| middleware.register({
|   bendahara: () => import('#middleware/bendahara_auth_middleware'),
| })
|
*/

// Halaman utama dan lainnya
router.on('/').render('pages/home')
router.on('/menu').render('pages/menu')
router.on('/about').render('pages/about')

// Rute Otentikasi
router.get('/login', [AuthController, 'showLogin'])
router.post('/login', [AuthController, 'handleLogin'])
router.post('/logout', [AuthController, 'logout'])

// Grup Rute Khusus Bendahara
router
  .group(() => {
    router.on('/dashboard').render('pages/admin_dashboard')
    // Tambahkan rute bendahara lainnya di sini
  })
  .prefix('/bendahara')
  .use(middleware.bendahara()) // <-- Baris ini sekarang tidak akan error lagi
