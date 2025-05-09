import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import {
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
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

onAuthStateChanged(auth, user => {
	if (user) window.location.href = '/index.html'
})

document.getElementById('login-form').addEventListener('submit', async e => {
	e.preventDefault()
	const email = document.getElementById('login-email').value
	const password = document.getElementById('login-password').value
	try {
		await signInWithEmailAndPassword(auth, email, password)
		window.location.href = '/index.html'
	} catch (err) {
		alert(err.message)
	}
})
