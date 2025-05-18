import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import {
	getAuth,
	onAuthStateChanged,
	signOut,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	onSnapshot,
	query,
	setDoc,
	Timestamp,
	updateDoc,
	where,
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

function renderUsers(snapshot) {
	const usersTable = document.getElementById('users-table')
	usersTable.innerHTML = ''

	if (snapshot.empty) {
		usersTable.innerHTML = '<tr><td colspan="3">Нет пользователей</td></tr>'
		updateCounter('user-count', 0)
		return
	}

	snapshot.forEach(doc => {
		const user = doc.data()
		console.log('Загружен пользователь:', user)
		usersTable.innerHTML += `
      <tr>
        <td>${user.email || '—'}</td>
        <td>${user.role || '—'}</td>
        <td>${user.rating?.toFixed(1) || '—'}</td>
      </tr>
    `
	})

	updateCounter('user-count', snapshot.size)
}
// Загрузка активных пользователей в админку
async function loadUsers() {
	try {
		const q = query(collection(db, 'users'))
		const querySnapshot = await getDocs(q)
		renderUsers(querySnapshot)
	} catch (error) {
		console.error('Ошибка загрузки пользователей:', error)
		showError('Не удалось загрузить пользователей')
	}
}
//подгрузка активных аренд на данный момент времени
async function loadActiveRentals() {
	try {
		const q = query(
			collection(db, 'rentals'),
			where('status', '==', 'активная')
		)
		const querySnapshot = await getDocs(q)
		renderRentals(querySnapshot)
	} catch (error) {
		console.error('Ошибка загрузки аренд:', error)
		showError('Не удалось загрузить аренды')
	}
}

function renderRentals(snapshot) {
	const rentsTable = document.getElementById('rents-table')
	rentsTable.innerHTML = ''

	if (snapshot.empty) {
		rentsTable.innerHTML = '<tr><td colspan="5">Нет активных аренд</td></tr>'
		return
	}

	const rows = []

	snapshot.forEach(doc => {
		const rental = doc.data()
		rows.push(
			(async () => {
				const tenantEmail = await getUsername(rental.tenantID)
				return `
          <tr data-id="${doc.id}">
            <td>${tenantEmail}</td>
            <td>${formatDate(rental.Start_Date)}</td>
            <td>${calculateDuration(rental)}</td>
            <td>${calculateRemainingDays(rental.End_Date)}</td>
            <td>
              <button class="edit-btn">✏️</button>
              <button class="delete-btn">🗑️</button>
            </td>
          </tr>
        `
			})()
		)
	})

	Promise.all(rows).then(results => {
		rentsTable.innerHTML = results.join('')
		addRentalActions()
	})
}

async function getUsername(userId) {
	try {
		const userDoc = await getDoc(doc(db, 'users', userId))
		return userDoc.data()?.email || 'Неизвестный пользователь'
	} catch {
		return 'Ошибка загрузки'
	}
}
// Работа с арендами
function formatDate(timestamp) {
	if (!timestamp) return '—'
	return new Date(timestamp.toDate()).toLocaleDateString('ru-RU')
}

function calculateDuration(rental) {
	const start = rental.Start_Date?.toDate()
	const end = rental.End_Date?.toDate()
	if (!start || !end) return '—'
	const days = Math.ceil((end - start) / (1000 * 3600 * 24))
	return `${days} дней`
}

function calculateRemainingDays(endDate) {
	if (!endDate) return '—'
	const now = new Date()
	const end = endDate.toDate()
	const days = Math.ceil((end - now) / (1000 * 3600 * 24))
	return days > 0 ? `${days} дней` : 'Завершено'
}

function addRentalActions() {
	document.querySelectorAll('.delete-btn').forEach(btn => {
		btn.addEventListener('click', handleDelete)
	})

	document.querySelectorAll('.edit-btn').forEach(btn => {
		btn.addEventListener('click', handleEdit)
	})
}

async function handleDelete(e) {
	if (!confirm('Удалить аренду?')) return

	try {
		const rentalId = e.target.closest('tr').dataset.id
		await deleteDoc(doc(db, 'rentals', rentalId))
		showSuccess('Аренда удалена!')
	} catch (error) {
		console.error('Ошибка удаления:', error)
		showError('Не удалось удалить аренду')
	}
}

function handleEdit(e) {
	const rentalId = e.target.closest('tr').dataset.id
	openEditModal(rentalId)
}

function initModals() {
	const modal = document.getElementById('edit-modal')
	const closeBtns = modal.querySelectorAll('.close')

	closeBtns.forEach(btn => {
		btn.addEventListener('click', () => (modal.style.display = 'none'))
	})

	window.addEventListener('click', e => {
		if (e.target === modal) modal.style.display = 'none'
	})

	document.getElementById('edit-form').addEventListener('submit', async e => {
		e.preventDefault()
		try {
			const rentalId = document.getElementById('edit-id').value
			const endDateValue = document.getElementById('edit-end-date').value
			const endDate = Timestamp.fromDate(new Date(endDateValue))

			await updateDoc(doc(db, 'rentals', rentalId), {
				End_Date: endDate,
			})

			modal.style.display = 'none'
			showSuccess('Изменения сохранены!')
		} catch (error) {
			console.error('Ошибка обновления:', error)
			showError('Ошибка сохранения изменений')
		}
	})
}

function openEditModal(rentalId) {
	document.getElementById('edit-id').value = rentalId
	document.getElementById('edit-modal').style.display = 'block'
}

function setupRealTimeUpdates() {
	const unsubUsers = onSnapshot(query(collection(db, 'users')), renderUsers)

	const unsubRentals = onSnapshot(collection(db, 'rentals'), snapshot => {
		const activeRentals = snapshot.docs.filter(
			doc => doc.data().status === 'активная'
		)
		renderRentals({
			empty: activeRentals.length === 0,
			forEach: fn => activeRentals.forEach(fn),
		})
	})

	window.addEventListener('beforeunload', () => {
		unsubUsers()
		unsubRentals()
	})
}

function updateCounter(elementId, count) {
	const element = document.getElementById(elementId)
	if (element) element.textContent = count
}

function showError(message) {
	alert(`❌ ${message}`)
}

function showSuccess(message) {
	alert(`✅ ${message}`)
}
// Проверка на админа
onAuthStateChanged(auth, async user => {
	if (!user) {
		window.location.href = 'html/auth.html'
	} else if (user.email !== 'ghkolnyk238@gmail.com') {
		alert('Доступ запрещен')
		window.location.href = '/index.html'
	} else {
		const userRef = doc(db, 'users', user.uid)
		const userSnap = await getDoc(userRef)

		if (!userSnap.exists()) {
			await setDoc(userRef, {
				email: user.email,
				role: 'админ',
				rating: 5.0,
				isOnline: true,
			})
		} else {
			await setDoc(
				userRef,
				{
					email: user.email,
					role: userSnap.data().role || 'админ',
					rating: userSnap.data().rating ?? 5.0,
					isOnline: true,
				},
				{ merge: true }
			)
		}

		window.addEventListener('beforeunload', async () => {
			await setDoc(userRef, { isOnline: false }, { merge: true })
		})

		loadDashboardData()
	}
})

document.getElementById('logout-link').addEventListener('click', e => {
	e.preventDefault()
	signOut(auth)
		.then(() => (window.location.href = '/index.html'))
		.catch(error => console.error('Ошибка выхода:', error))
})

async function loadDashboardData() {
	try {
		await Promise.all([loadUsers(), loadActiveRentals()])
		setupRealTimeUpdates()
		initModals()
	} catch (error) {
		console.error('Ошибка загрузки данных:', error)
		showError('Ошибка загрузки данных!')
	}
}

document.addEventListener('DOMContentLoaded', () => {
	document
		.getElementById('add-rental-form')
		.addEventListener('submit', async e => {
			e.preventDefault()

			const startDateValue = document.getElementById('Start_Date').value
			const endDateValue = document.getElementById('End_Date').value
			const itemID = document.getElementById('Item_ID').value

			if (!startDateValue || !endDateValue || !itemID) {
				showError('Пожалуйста, заполните все поля')
				return
			}

			try {
				const startDate = Timestamp.fromDate(new Date(startDateValue))
				const endDate = Timestamp.fromDate(new Date(endDateValue))

				await addDoc(collection(db, 'rentals'), {
					Item_ID: itemID,
					Start_Date: startDate,
					End_Date: endDate,
					status: 'активная',
					Tenant_ID: auth.currentUser.uid,
				})

				showSuccess('Аренда успешно добавлена')
				e.target.reset()
			} catch (error) {
				console.error('Ошибка добавления аренды:', error)
				showError(`Не удалось добавить аренду: ${error.message || error}`)
			}
		})
})
