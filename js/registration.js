import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import {
	createUserWithEmailAndPassword,
	getAuth,
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

document.getElementById('signup-form').addEventListener('submit', async e => {
	e.preventDefault()
	const email = document.getElementById('signup-email').value
	const password = document.getElementById('signup-password').value
	const confirm = document.getElementById('signup-confirm').value
	if (password !== confirm) {
		alert('Пароли не совпадают')
		return
	}
	try {
		await createUserWithEmailAndPassword(auth, email, password)
		window.location.href = '/index.html'
	} catch (err) {
		alert(err.message)
	}
})
