import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import {
	getAuth,
	onAuthStateChanged,
	signOut,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js'

const firebaseConfig = {
	apiKey: 'AIzaSyCc2hhtLfgpzSY_Ocv9ynMsEdwjmAX1IkA',
	authDomain: 'zipp-app-ff02d.firebaseapp.com',
	projectId: 'zipp-app-ff02d',
	storageBucket: 'zipp-app-ff02d.firebasestorage.app',
	messagingSenderId: '443537030400',
	appId: '1:443537030400:web:18fedfe4c17911fe9807e5',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Список админских email
const ADMIN_EMAILS = ['ghkolnyk238@gmail.com']

function addAdminButton() {
	const sidebar = document.querySelector('.sidebar')
	const existingAdminBtn = document.getElementById('admin-btn')

	if (existingAdminBtn) return

	const adminBtn = document.createElement('button')
	adminBtn.id = 'admin-btn'
	adminBtn.textContent = 'Админ-панель'
	adminBtn.onclick = () => (window.location.href = 'dashboard.html')

	const logoutBtn = document.getElementById('logout-btn')
	sidebar.insertBefore(adminBtn, logoutBtn)
}

onAuthStateChanged(auth, user => {
	if (!user) {
		window.location.href = 'auth.html'
	} else {
		document.getElementById('user-email').textContent = user.email

		// Проверяем email пользователя
		if (ADMIN_EMAILS.includes(user.email)) {
			addAdminButton()
			document.getElementById('role').textContent = 'Администратор'
		} else {
			document.getElementById('role').textContent = 'Пользователь'
		}
	}
})

document
	.getElementById('logout-btn')
	.addEventListener('click', () => signOut(auth))

document.getElementById('rentals-btn').addEventListener('click', () => {
	document.getElementById('rentals').scrollIntoView({ behavior: 'smooth' })
})
