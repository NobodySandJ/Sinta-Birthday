document.addEventListener('DOMContentLoaded', () => {
    // === DOM References ===
    const root = document.documentElement;
    const backgroundAnimation = document.getElementById('background-animation');
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');

    // Welcome Screen
    const yearSlider = document.getElementById('birthyear-slider');
    const yearDisplay = document.getElementById('year-display');
    const themeOptions = document.getElementById('theme-options'); // REVISI: Mengambil kontainer tema
    const giftBox = document.getElementById('gift-box');

    // Main Content
    const cakeContainer = document.getElementById('cake-container');
    const svgCake = document.getElementById('cake-svg');
    const greetingLine1 = document.getElementById('greeting-line-1');
    const greetingLine2 = document.getElementById('greeting-line-2');
    const personalMessageEl = document.getElementById('personal-message');
    const personalSignatureEl = document.getElementById('personal-signature');
    const timelineContainer = document.getElementById('timeline-container');
    const photoGallery = document.getElementById('photo-gallery');
    const videoList = document.getElementById('video-list');

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Music Player
    const musicPlayer = document.getElementById('music-player');
    const audioElement = document.getElementById('audio-element');
    const playerArtwork = document.getElementById('player-artwork');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>`;
    const pauseIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="currentColor"/></svg>`;

    // === App State ===
    let appContent = {};
    let playlist = [], currentTrackIndex = 0, isPlaying = false;

    // === SVG Cake Data ===
    const cakePaths = {
        bizcocho_1: 'M173.667,21.571c-33.174,0-111.467,0-147.334,0c-4,0-4-16.002,0-16.002c39.836,0,105.982,0,147.334,0 C177.668,5.569,177.667,21.571,173.667,21.571z',
        relleno_1: 'M101.368-73.685c0,12.164,0,15.18,0,28.519c0,22.702,0-13.661,0,8.304c0,14.48,0,18.233,0,30.512 c0,1.753-2.958,1.847-2.958,0c0-12.68,0-16.277,0-30.401c0-21.983,0,11.66,0-8.305c0-13.027,0-15.992,0-28.628 C98.411-75.883,101.368-75.592,101.368-73.685z',
        bizcocho_2: 'M173.667-15.929c-46.512,0-105.486,0-147.334,0c-3.999,0-4-16.002,0-16.002 c43.566,0,97.96,0,147.334,0C177.667-31.931,177.666-15.929,173.667-15.929z',
        relleno_2: 'M100-178.521c1.858,0,3.364,1.506,3.364,3.363c0,0,0,33.17,0,44.227 c0,19.144,0,57.431,0,76.574c0,10.152,0,40.607,0,40.607c0,1.858-1.506,3.364-3.364,3.364l0,0c-1.858,0-3.364-1.506-3.364-3.364c0,0,0-30.455,0-40.607c0-19.144,0-57.432,0-76.575c0-11.057,0-44.226,0-44.226C96.636-177.015,98.142-178.521,100-178.521 L100-178.521z',
        bizcocho_3: 'M173.667-13.94c-49.298,0-102.782,0-147.334,0c-3.999,0-4-16.002,0-16.002 c44.697,0,96.586,0,147.334,0C177.667-29.942,177.668-13.94,173.667-13.94z',
        crema: 'M104.812,113.216c0,3.119-2.164,5.67-4.812,5.67c-2.646,0-4.812-2.551-4.812-5.67c0-5.594,0-16.782,0-22.375 c0-5.143,0-15.427,0-20.568c0-7.333,0-21.998,0-29.33c0-5.523,0-16.569,0-22.092c0-3.295,0-9.885,0-13.181 C95.188,2.551,97.353,0,100,0c2.648,0,4.812,2.551,4.812,5.669c0,3.248,0,9.743,0,12.991c0,5.428,0,16.284,0,21.711 c0,7.618,0,22.854,0,30.472c0,4.952,0,14.854,0,19.807C104.812,96.292,104.812,107.576,104.812,113.216z'
    };

    function buildSvgCake() {
        const createPath = (d, fill, animId) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.setAttribute("fill", fill);
            path.id = animId;
            return path;
        };
        svgCake.appendChild(createPath(cakePaths.bizcocho_1, "var(--accent-color)", "bizcocho_1_anim"));
        svgCake.appendChild(createPath(cakePaths.relleno_1, "#8b6a60", "relleno_1_anim"));
        svgCake.appendChild(createPath(cakePaths.bizcocho_2, "var(--accent-color)", "bizcocho_2_anim"));
        svgCake.appendChild(createPath(cakePaths.relleno_2, "#8b6a60", "relleno_2_anim"));
        svgCake.appendChild(createPath(cakePaths.bizcocho_3, "var(--accent-color)", "bizcocho_3_anim"));
        svgCake.appendChild(createPath(cakePaths.crema, "#fefae9", "crema_anim"));

        const velaDiv = document.createElement('div');
        velaDiv.className = 'velas';
        velaDiv.id = 'vela_anim';
        for (let i = 0; i < 5; i++) {
            const fuegoDiv = document.createElement('div');
            fuegoDiv.className = 'fuego';
            velaDiv.appendChild(fuegoDiv);
        }
        cakeContainer.appendChild(velaDiv);
    }

    // === Initialization ===
    async function initializeApp() {
        try {
            const response = await fetch('content.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            appContent = await response.json();

            playlist = appContent.playlist || [];
            if (playlist.length > 0) loadTrack(currentTrackIndex, false); // Don't autoplay yet

            populateTimeline();
            populateGallery();
            populateVideos();
            createBgParticles(30);
            buildSvgCake();
        } catch (error) {
            console.error("Could not load content:", error);
            document.body.innerHTML = "<h1>Gagal memuat konten. Coba refresh halaman.</h1>";
        }
    }

    // === Feature Functions ===
    function createBgParticles(count) {
        const shapes = ['💖', '✨', '🌟', '🎶', '🎉', '♍', '🎀', '🎂', '🎈'];
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'bg-particle';
            particle.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
            const size = Math.random() * 60 + 20;
            particle.style.fontSize = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 20 + 20}s`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            backgroundAnimation.appendChild(particle);
        }
    }

    function triggerConfetti() {
        const confettiCount = 100;
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'];
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            if (i % 2 === 0) confetti.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'; // star
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    async function typewriter(element, text, delay = 80) {
        element.innerHTML = '';
        for (const char of text) {
            element.innerHTML += char;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    // === Content Population ===
    function populateTimeline() {
        timelineContainer.innerHTML = appContent.timelineItems.map((item, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            return `<div class="timeline-item ${side}"><div class="timeline-content"><h3>${item.year} - ${item.title}</h3><p>${item.description}</p></div></div>`;
        }).join('');
    }

    function populateGallery() {
        photoGallery.innerHTML = appContent.galleryImages.map(imageName =>
            `<img src="assets/img/${imageName}" alt="Foto Kenangan Sinta">`
        ).join('');
    }

    function populateVideos() {
        videoList.innerHTML = appContent.videos.map(video =>
            `<div class="video-wrapper"><iframe src="${video.url}" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
        ).join('');
    }

    // === Music Player Logic ===
    function loadTrack(index, play = true) {
        if (!playlist || playlist.length === 0) return;
        const track = playlist[index];
        audioElement.src = track.path;
        playerArtwork.src = track.artwork;
        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist;
        playPauseBtn.innerHTML = playIcon;
        if (play) playTrack();
    }

    function playTrack() {
        if (!playlist || playlist.length === 0) return;
        isPlaying = true;
        audioElement.play().catch(e => console.error("Audio play failed:", e));
        playPauseBtn.innerHTML = pauseIcon;
    }

    function pauseTrack() {
        isPlaying = false;
        audioElement.pause();
        playPauseBtn.innerHTML = playIcon;
    }

    const togglePlayPause = () => isPlaying ? pauseTrack() : playTrack();
    const prevTrack = () => loadTrack((currentTrackIndex - 1 + playlist.length) % playlist.length);
    const nextTrack = () => loadTrack((currentTrackIndex + 1) % playlist.length);

    // === Event Listeners ===
    yearSlider.addEventListener('input', e => yearDisplay.textContent = e.target.value);

    themeOptions.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('theme-option')) {
            themeOptions.querySelectorAll('.theme-option').forEach(option => {
                option.classList.remove('selected');
            });
            target.classList.add('selected');
            const newColor = target.dataset.color;
            root.style.setProperty('--accent-color', newColor);
        }
    });

    giftBox.addEventListener('click', () => {
        giftBox.classList.add('open');

        setTimeout(() => {
            const selectedYear = parseInt(yearSlider.value, 10);
            const age = new Date().getFullYear() - selectedYear;
            const greeting1 = appContent.personalGreeting;
            const greeting2 = `yang ke-${age}!`;
            personalMessageEl.textContent = appContent.personalMessage;
            personalSignatureEl.textContent = appContent.personalSignature;

            welcomeScreen.classList.add('hidden');

            welcomeScreen.addEventListener('transitionend', async () => {
                triggerConfetti();
                mainContent.classList.add('visible');
                if (playlist.length > 0 && !isPlaying) playTrack();

                cakeContainer.classList.add('animate');

                await typewriter(greetingLine1, greeting1, 100);
                await typewriter(greetingLine2, greeting2, 120);

            }, { once: true });
        }, 400); // Wait for gift box animation
    });

    photoGallery.addEventListener('click', e => {
        if (e.target.tagName === 'IMG') {
            lightbox.style.display = 'block';
            lightboxImg.src = e.target.src;
        }
    });
    lightboxClose.addEventListener('click', () => lightbox.style.display = 'none');
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });

    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    audioElement.addEventListener('ended', nextTrack);
    audioElement.addEventListener('play', () => isPlaying = true);
    audioElement.addEventListener('pause', () => isPlaying = false);

    initializeApp();
});