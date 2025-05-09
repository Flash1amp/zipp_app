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
	if (!user) {
		window.location.href = 'html/auth.html'
	} else {
		const profileBtn = document.getElementById('profile-btn')
		const welcomeToast = document.getElementById('welcome-toast')
		const toastEmail = document.getElementById('toast-email')

		profileBtn.textContent = user.email
		toastEmail.textContent = user.email

		welcomeToast.classList.add('active')

		setTimeout(() => {
			welcomeToast.classList.remove('active')
			setTimeout(() => {
				welcomeToast.style.display = 'none'
			}, 500)
		}, 4000)
	}
})

document.getElementById('logout-btn').addEventListener('click', () => {
	signOut(auth)
})

document.getElementById('profile-btn').addEventListener('click', () => {
	window.location.href = 'html/profile.html'
})

// Кастомная плавная прокрутка
function smoothScroll(targetElement, duration = 2000) {
	const startPosition = window.pageYOffset
	const targetPosition =
		targetElement.getBoundingClientRect().top + startPosition - 100
	let startTime = null

	const ease = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

	function animation(currentTime) {
		if (!startTime) startTime = currentTime
		const timeElapsed = currentTime - startTime
		const progress = ease(Math.min(timeElapsed / duration, 1))

		window.scrollTo(
			0,
			startPosition + (targetPosition - startPosition) * progress
		)

		if (timeElapsed < duration) requestAnimationFrame(animation)
	}

	requestAnimationFrame(animation)
}

// Обработчики событий
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault()
		const target = document.querySelector(this.getAttribute('href'))
		if (target) smoothScroll(target, 1500)
	})
})

// Карусель отзывов
let currentReview = 0
const reviewItems = document.querySelectorAll('.rewiew-item')
const totalReviews = reviewItems.length
const reviewList = document.querySelector('.rewiews-list')

function updateReviews() {
	const offset = -currentReview * (reviewItems[0].offsetWidth + 40)
	reviewList.style.transform = `translateX(${offset}px)`
}

document
	.querySelector('.reviews-section .prev-btn')
	.addEventListener('click', () => {
		if (currentReview > 0) currentReview--
		else currentReview = totalReviews - 1
		updateReviews()
	})

document
	.querySelector('.reviews-section .next-btn')
	.addEventListener('click', () => {
		if (currentReview < totalReviews - 1) currentReview++
		else currentReview = 0
		updateReviews()
	})

// Карусель самокатов
let currentScooter = 0
const scooters = document.querySelectorAll('.scooter-content')
const totalScooters = scooters.length

function showScooter(index) {
	scooters.forEach((scooter, i) => {
		scooter.style.display = i === index ? 'flex' : 'none'
	})
}

document
	.querySelector('.scooter-section .prev-btn')
	.addEventListener('click', () => {
		currentScooter = currentScooter > 0 ? currentScooter - 1 : totalScooters - 1
		showScooter(currentScooter)
	})

document
	.querySelector('.scooter-section .next-btn')
	.addEventListener('click', () => {
		currentScooter = currentScooter < totalScooters - 1 ? currentScooter + 1 : 0
		showScooter(currentScooter)
	})

updateReviews()
showScooter(0)

function smoothScrollToTop() {
	const startPosition = window.pageYOffset
	const targetPosition = 0
	const distance = targetPosition - startPosition
	const duration = 800
	let startTime = null

	function animation(currentTime) {
		if (startTime === null) startTime = currentTime
		const timeElapsed = currentTime - startTime
		const run = easeInOutQuad(timeElapsed, startPosition, distance, duration)
		window.scrollTo(0, run)
		if (timeElapsed < duration) requestAnimationFrame(animation)
	}

	function easeInOutQuad(t, b, c, d) {
		t /= d / 2
		if (t < 1) return (c / 2) * t * t + b
		t--
		return (-c / 2) * (t * (t - 2) - 1) + b
	}

	requestAnimationFrame(animation)
}

document.addEventListener('DOMContentLoaded', () => {
	const scrollButton = document.createElement('button')
	scrollButton.className = 'scroll-to-top'
	scrollButton.setAttribute('aria-label', 'Наверх')
	scrollButton.innerHTML = '↑'
	document.body.appendChild(scrollButton)

	window.addEventListener('scroll', () => {
		scrollButton.classList.toggle('active', window.scrollY > 300)
	})

	scrollButton.addEventListener('click', smoothScrollToTop)
})

class ScooterSlider {
	constructor() {
		this.slider = document.querySelector('.scooter-slider')
		this.slides = Array.from(document.querySelectorAll('.scooter-content'))
		this.dotsContainer = document.querySelector('.slider-dots')
		this.prevBtn = document.querySelector('.prev-btn')
		this.nextBtn = document.querySelector('.next-btn')
		this.currentIndex = 0

		this.initDots()
		this.setActiveSlide(this.currentIndex)
		this.addEventListeners()
	}

	initDots() {
		this.slides.forEach((_, index) => {
			const dot = document.createElement('div')
			dot.className = 'slider-dot'
			dot.addEventListener('click', () => this.setActiveSlide(index))
			this.dotsContainer.appendChild(dot)
		})
	}

	setActiveSlide(index) {
		this.slides.forEach(slide => slide.classList.remove('active'))

		this.slides[index].classList.add('active')

		const dots = Array.from(this.dotsContainer.children)
		dots.forEach(dot => dot.classList.remove('active'))
		dots[index].classList.add('active')

		this.currentIndex = index
		this.updateButtons()
	}

	updateButtons() {
		this.prevBtn.disabled = this.currentIndex === 0
		this.nextBtn.disabled = this.currentIndex === this.slides.length - 1
	}

	addEventListeners() {
		this.prevBtn.addEventListener('click', () => {
			if (this.currentIndex > 0) {
				this.setActiveSlide(this.currentIndex - 1)
			}
		})

		this.nextBtn.addEventListener('click', () => {
			if (this.currentIndex < this.slides.length - 1) {
				this.setActiveSlide(this.currentIndex + 1)
			}
		})
	}
}

window.addEventListener('DOMContentLoaded', () => {
	new ScooterSlider()
})
