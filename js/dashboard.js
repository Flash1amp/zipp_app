import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import {
	getAuth,
	onAuthStateChanged,
	signOut,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js'
import {
	collection,
	getDocs,
	getFirestore,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'

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
const db = getFirestore(app)

onAuthStateChanged(auth, user => {
	if (!user) {
		window.location.href = 'html/auth.html'
	} else if (user.email !== 'ghkolnyk238@gmail.com') {
		alert('Доступ запрещен')
		window.location.href = '/index.html'
	} else {
		loadDashboardData()
	}
})

document.getElementById('logout-link').addEventListener('click', e => {
	e.preventDefault()
	signOut(auth)
})

// Загрузка данных из Firestore
async function loadDashboardData() {
	// Пользователи
	const usersSnap = await getDocs(collection(db, 'users'))
	document.getElementById('user-count').textContent = usersSnap.size
	const usersTable = document.getElementById('users-table')
	usersSnap.forEach(doc => {
		const { email, createdAt } = doc.data()
		const tr = document.createElement('tr')
		tr.innerHTML = `<td>${email}</td><td>${new Date(
			createdAt
		).toLocaleString()}</td>`
		usersTable.appendChild(tr)
	})

	// Отчеты
	const reportsSnap = await getDocs(collection(db, 'reports'))
	document.getElementById('reports-count').textContent = reportsSnap.size
	const reportsTable = document.getElementById('reports-table')
	reportsSnap.forEach(doc => {
		const { filename, uploadedAt } = doc.data()
		const tr = document.createElement('tr')
		tr.innerHTML = `<td>${filename}</td><td>${new Date(
			uploadedAt
		).toLocaleString()}</td>`
		reportsTable.appendChild(tr)
	})
}

// Загрузка аренд
const rentsSnap = await getDocs(collection(db, 'rents'))
const rentsTable = document.getElementById('rents-table')

rentsSnap.forEach(async doc => {
	const data = doc.data()
	const tr = document.createElement('tr')

	const userSnap = await getDocs(collection(db, 'users'))
	let email = 'не найден'
	userSnap.forEach(userDoc => {
		if (userDoc.id === data.userId) {
			email = userDoc.data().email
		}
	})

	const now = Date.now()
	const end = data.startTime + data.durationMs
	const remaining = Math.max(0, end - now)

	tr.innerHTML = `
		<td>${email}</td>
		<td>${new Date(data.startTime).toLocaleString()}</td>
		<td>${Math.floor(data.durationMs / 60000)} мин</td>
		<td class="time-left" data-end="${end}">${formatTime(remaining)}</td>
		<td><button data-id="${doc.id}" class="delete-rent">Удалить</button></td>
	`
	rentsTable.appendChild(tr)
})

function formatTime(ms) {
	const minutes = Math.floor(ms / 60000)
	const seconds = Math.floor((ms % 60000) / 1000)
	return `${minutes}м ${seconds}с`
}

setInterval(() => {
	document.querySelectorAll('.time-left').forEach(el => {
		const end = +el.dataset.end
		const remaining = Math.max(0, end - Date.now())
		el.textContent = formatTime(remaining)
	})
}, 1000)

import {
	deleteDoc,
	doc,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'

document.addEventListener('click', async e => {
	if (e.target.classList.contains('delete-rent')) {
		const id = e.target.dataset.id
		await deleteDoc(doc(db, 'rents', id))
		e.target.closest('tr').remove()
	}
})
