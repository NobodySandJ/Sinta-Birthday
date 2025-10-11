document.addEventListener('DOMContentLoaded', () => {

    // Global state
    const appState = {
        content: {},
        birthYear: 2001,
        themeColor: '#ff6b9d'
    };

    // Pindah semua elemen ke sini
    const elements = {
        // Welcome Screen
        welcomeScreen: document.getElementById('welcome-screen'),
        yearSlider: document.getElementById('birthyear-slider'),
        yearDisplay: document.getElementById('year-display'),
        themeOptions: document.getElementById('theme-options'),
        giftBox: document.getElementById('lottie-gift-container'),

        // Loading Screen
        loadingScreen: document.getElementById('loading-screen'),
        loadingContent: document.querySelector('#loading-screen .loading-content'),
        startButton: document.getElementById('start-surprise-btn'),

        // Ucapan Content (yang tadinya di ucapan.html)
        ucapanContent: document.getElementById('ucapan-content'),
        root: document.documentElement,
        backgroundAnimation: document.getElementById('background-animation'),
        progressBar: document.getElementById('progress-bar'),
        greetingLine1: document.getElementById('greeting-line-1'),
        greetingLine2: document.getElementById('greeting-line-2'),
        personalMessage: document.getElementById('personal-message'),
        personalSignature: document.getElementById('personal-signature'),
        timelineContainer: document.getElementById('timeline-container'),
        photoGallery: document.getElementById('photo-gallery'),
        videoList: document.getElementById('video-list'),
        lightbox: document.getElementById('lightbox'),
        lightboxImg: document.getElementById('lightbox-img'),
        lightboxClose: document.querySelector('.lightbox-close'),
        audioElement: document.getElementById('audio-element'),
        playerArtwork: document.getElementById('player-artwork'),
        playerTitle: document.getElementById('player-title'),
        playerArtist: document.getElementById('player-artist'),
        playPauseBtn: document.getElementById('play-pause-btn'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
    };
    
    // ===================================================================
    // UTILS & RENDERERS (Tetap sama, tidak perlu diubah)
    // ===================================================================
    
    const utils = {
        async typewriter(element, text, delay = 80) {
            element.innerHTML = '';
            const textNode = document.createTextNode('');
            const cursorSpan = document.createElement('span');
            cursorSpan.className = 'cursor';
            cursorSpan.textContent = '|';
            element.appendChild(textNode);
            element.appendChild(cursorSpan);
            element.classList.add('typing');
            for (let i = 0; i < text.length; i++) {
                textNode.nodeValue += text[i];
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            setTimeout(() => {
                element.classList.remove('typing');
                cursorSpan.remove();
            }, 500);
        },
        triggerConfetti() {
            const confettiCount = 50;
            const colors = ['#ff6b9d', '#4ecdc4', '#feca57', '#ff9ff3', '#54a0ff'];
            for (let i = 0; i < confettiCount; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = `${Math.random() * 100}vw`;
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = `${Math.random() * 2}s`;
                confetti.style.animationDuration = `${Math.random() * 3 + 4}s`;
                document.body.appendChild(confetti);
                setTimeout(() => confetti?.remove(), 8000);
            }
        },
        createBgParticles(count = 15) {
            const shapes = ['💖', '✨', '🌟', '🎶', '🎉', '♍', '🎀', '🎂'];
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'bg-particle';
                particle.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
                const size = Math.random() * 40 + 30;
                particle.style.fontSize = `${size}px`;
                particle.style.left = `${Math.random() * 100}vw`;
                particle.style.animationDuration = `${Math.random() * 15 + 20}s`;
                particle.style.animationDelay = `${Math.random() * 10}s`;
                elements.backgroundAnimation.appendChild(particle);
            }
        },
        updateScrollProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            elements.progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
        },
        observeElements() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
        },
        updateThemeColor(color) {
            elements.root.style.setProperty('--accent-color', color);
            const colorMap = { '#ff6b9d': '#4ecdc4', '#4ecdc4': '#ff6b9d', '#a88679': '#ff6b9d', '#e91e63': '#4ecdc4', '#673ab7': '#4ecdc4', '#00bcd4': '#ff6b9d', '#4caf50': '#ff6b9d', '#ff9800': '#4ecdc4' };
            elements.root.style.setProperty('--accent-secondary', colorMap[color] || '#4ecdc4');
            elements.root.style.setProperty('--glow-color', color + '40');
        }
    };

    const contentRenderer = {
        renderTimeline() {
            elements.timelineContainer.innerHTML = appState.content.timelineItems.map((item, index) => {
                const side = index % 2 === 0 ? 'left' : 'right';
                const imageHtml = item.image ? `<img src="${item.image}" alt="${item.title}" class="timeline-image">` : '';
                return `
                    <div class="timeline-item ${side}">
                        <div class="timeline-content">
                            ${imageHtml}
                            <h3>${item.year} - ${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    </div>`;
            }).join('');
        },
        renderGallery() {
            elements.photoGallery.innerHTML = appState.content.galleryImages.map((src, i) => `<img src="${src}" alt="Foto Kenangan ${i + 1}">`).join('');
        },
        renderVideos() {
            elements.videoList.innerHTML = appState.content.videos.map(video => {
                const isPortrait = video.orientation === 'portrait';
                const wrapperClass = `video-wrapper ${isPortrait ? 'portrait' : ''}`;
                return `<div class="${wrapperClass.trim()}">
                            <video src="${video.url}" title="${video.title}" controls playsinline loop muted></video>
                        </div>`;
            }).join('');
        }
    };
    
    const musicPlayer = {
        init() {
            if (appState.content.playlist?.length) this.loadTrack(0, false);
        },
        loadTrack(index, autoplay = true) {
            const track = appState.content.playlist[index];
            appState.currentTrackIndex = index;
            elements.audioElement.src = track.path;
            elements.playerArtwork.src = track.artwork;
            elements.playerTitle.textContent = track.title;
            elements.playerArtist.textContent = track.artist;
            this.updatePlayButton(false);
            if (autoplay) this.play();
        },
        play() {
            if (!appState.content.playlist?.length) return;
            const playPromise = elements.audioElement.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.updatePlayButton(true);
                }).catch(error => {
                    console.error("Gagal memulai audio:", error);
                    this.updatePlayButton(false);
                });
            }
        },
        pause() {
            elements.audioElement.pause();
            this.updatePlayButton(false);
        },
        togglePlayPause() {
            elements.audioElement.paused ? this.play() : this.pause();
        },
        previousTrack() {
            const prev = (appState.currentTrackIndex - 1 + appState.content.playlist.length) % appState.content.playlist.length;
            this.loadTrack(prev);
        },
        nextTrack() {
            const next = (appState.currentTrackIndex + 1) % appState.content.playlist.length;
            this.loadTrack(next);
        },
        updatePlayButton(isPlaying) {
            elements.playPauseBtn.innerHTML = isPlaying ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="currentColor"/></svg>` : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>`;
        }
    };

    const eventHandlers = {
        init() {
            elements.photoGallery.addEventListener('click', (e) => {
                if (e.target.tagName === 'IMG') {
                    elements.lightbox.style.display = 'block';
                    elements.lightboxImg.src = e.target.src;
                }
            });
            elements.lightboxClose.addEventListener('click', this.closeLightbox);
            elements.lightbox.addEventListener('click', (e) => {
                if (e.target === elements.lightbox) this.closeLightbox();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeLightbox();
            });
            elements.playPauseBtn.addEventListener('click', () => musicPlayer.togglePlayPause());
            elements.prevBtn.addEventListener('click', () => musicPlayer.previousTrack());
            elements.nextBtn.addEventListener('click', () => musicPlayer.nextTrack());
            elements.audioElement.addEventListener('ended', () => musicPlayer.nextTrack());
            window.addEventListener('scroll', utils.updateScrollProgress, { passive: true });
        },
        closeLightbox() {
            elements.lightbox.style.display = 'none';
        }
    };

    // ===================================================================
    // LOGIKA UTAMA APLIKASI
    // ===================================================================

    // 1. Inisialisasi halaman awal
    function initWelcomeScreen() {
        elements.yearSlider.addEventListener('input', (e) => {
            elements.yearDisplay.textContent = e.target.value;
        });

        elements.themeOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-option')) {
                elements.themeOptions.querySelector('.selected')?.classList.remove('selected');
                e.target.classList.add('selected');
                const newColor = e.target.dataset.color;
                utils.updateThemeColor(newColor);
            }
        });

        elements.giftBox.addEventListener('click', handleGiftClick);

        const initialColor = elements.themeOptions.querySelector('.selected').dataset.color;
        utils.updateThemeColor(initialColor);
    }
    
    // 2. Saat kado diklik, tampilkan loading & mulai preload
    async function handleGiftClick() {
        // Simpan pilihan user
        appState.birthYear = elements.yearSlider.value;
        appState.themeColor = elements.themeOptions.querySelector('.selected').dataset.color;

        // Tampilkan layar loading
        elements.welcomeScreen.style.opacity = '0';
        elements.welcomeScreen.style.transform = 'scale(0.9)';
        setTimeout(() => {
            elements.welcomeScreen.style.display = 'none';
            elements.loadingScreen.style.display = 'flex';
            setTimeout(() => elements.loadingScreen.style.opacity = '1', 50);
        }, 500);

        // Mulai preload aset penting
        await preloadPriorityAssets();
    }

    // 3. Fungsi Preload Aset Prioritas
    async function preloadPriorityAssets() {
        const preloadAsset = (url) => {
            return new Promise((resolve, reject) => {
                const isAudio = /\.(mp3|wav|ogg)$/.test(url);
                if (isAudio) {
                    const audio = new Audio();
                    audio.src = url;
                    audio.addEventListener('canplaythrough', () => resolve(url), { once: true });
                    audio.onerror = () => reject(`Gagal memuat audio: ${url}`);
                } else {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve(url);
                    img.onerror = () => reject(`Gagal memuat gambar: ${url}`);
                }
            });
        };

        try {
            const response = await fetch('content.json');
            if (!response.ok) throw new Error('Gagal memuat content.json');
            appState.content = await response.json();

            const priorityAssets = [
                'assets/audio/JKT48 - Namida Surprise (cut).mp3',
                ...appState.content.galleryImages,
                ...appState.content.timelineItems.map(item => item.image).filter(Boolean),
                ...appState.content.playlist.map(track => track.artwork),
            ];
            
            const uniquePriorityAssets = [...new Set(priorityAssets)];
            const promises = uniquePriorityAssets.map(url => preloadAsset(url));

            await Promise.all(promises);
            console.log('Aset prioritas berhasil dimuat!');

        } catch (error) {
            console.error('Terjadi kesalahan saat memuat aset prioritas:', error);
        } finally {
            // Tampilkan tombol "Mulai"
            elements.loadingContent.classList.add('loading-done');
        }
    }
    
    // 4. Saat tombol "Mulai ✨" diklik
    elements.startButton.addEventListener('click', async () => {
        // Sembunyikan loading screen
        elements.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
            document.body.classList.add('with-player');
        }, 500);
        
        // Tampilkan konten ucapan
        elements.ucapanContent.style.display = 'block';

        // Inisialisasi semua fungsi untuk halaman ucapan
        musicPlayer.init();
        musicPlayer.play(); // <-- INI PEMICU MUSIKNYA
        
        utils.createBgParticles();
        utils.triggerConfetti();
        contentRenderer.renderTimeline();
        contentRenderer.renderGallery();
        contentRenderer.renderVideos();
        eventHandlers.init();
        utils.observeElements();
        utils.updateScrollProgress();

        // Mulai animasi mengetik
        const age = new Date().getFullYear() - parseInt(appState.birthYear, 10);
        const greeting1 = appState.content.personalGreeting;
        const greeting2 = `yang ke-${age}! 🎉`;
        const personalMessage = appState.content.personalMessage;
        const signature = appState.content.personalSignature;

        await utils.typewriter(elements.greetingLine1, greeting1, 100);
        await utils.typewriter(elements.greetingLine2, greeting2, 120);
        await new Promise(resolve => setTimeout(resolve, 300));
        await utils.typewriter(elements.personalMessage, personalMessage, 30);
        elements.personalSignature.textContent = signature;
        elements.personalSignature.style.opacity = 1;
    });

    // Jalankan inisialisasi awal
    initWelcomeScreen();
});