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

onAuthStateChanged(auth, user => {
	if (!user) window.location.href = 'auth.html'
	else document.getElementById('user-email').textContent = user.email
})

document
	.getElementById('logout-btn')
	.addEventListener('click', () => signOut(auth))
document.getElementById('rentals-btn').addEventListener('click', () => {
	document.getElementById('rentals').scrollIntoView({ behavior: 'smooth' })
})
