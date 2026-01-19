// LightWork Website - Main JavaScript
// Mimics nathangiordano.com's transition system and navigation

// R2 CDN base URL for media
const R2_BASE_URL = 'https://pub-456f19304a5c430d8c184ecc68198a3c.r2.dev';

// Convert local path to R2 URL
function getR2Url(localPath) {
    // Remove 'Portfolio-Content/' prefix and encode the path
    const r2Path = localPath.replace('Portfolio-Content/', '');
    return `${R2_BASE_URL}/${encodeURIComponent(r2Path).replace(/%2F/g, '/')}`;
}

// State
let isTransitioning = false;

// Elements
const homePage = document.getElementById('home-page');
const transitionOverlay = document.querySelector('.transition-overlay');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

// ===== Navigation System =====
function startTransition(destination) {
    if (isTransitioning) return;

    isTransitioning = true;
    document.body.classList.add('reloading');

    // Show transition overlay
    transitionOverlay.classList.add('fade-in');

    // Wait 500ms, then switch sections
    setTimeout(() => {
        // Switch sections within home page
        if (destination !== 'home') {
            switchSection(destination);
        }

        // Hold overlay for 1s after switching
        setTimeout(() => {
            transitionOverlay.classList.remove('fade-in');
            transitionOverlay.classList.add('fade-out');

            setTimeout(() => {
                transitionOverlay.classList.remove('fade-out');
                document.body.classList.remove('reloading');
                isTransitioning = false;
            }, 500);
        }, 1000);
    }, 500);
}

function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Update active nav icon
    const navIcons = document.querySelectorAll('.nav-icon');
    navIcons.forEach(icon => {
        icon.classList.remove('active');
        if (icon.dataset.page === sectionName) {
            icon.classList.add('active');
        }
    });

    // Unlock body scroll for all sections
    document.body.classList.remove('locked');

    // Close mobile menu if open
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        hamburger.classList.remove('active');
    }
}

// ===== Desktop Navigation =====
const navIcons = document.querySelectorAll('.nav-icon');
navIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        if (isTransitioning) return;

        const destination = icon.dataset.page;

        // Special handling for gallery button - scroll to masonry grid
        if (destination === 'gallery') {
            const filterSection = document.querySelector('.filter-section');
            if (filterSection) {
                filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }

        startTransition(destination);
    });
});

// ===== Mobile Navigation =====
if (hamburger) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('hidden');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenu &&
        !mobileMenu.classList.contains('hidden') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        hamburger.classList.remove('active');
    }
});

// Mobile menu items
const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
mobileMenuItems.forEach(item => {
    item.addEventListener('click', () => {
        if (isTransitioning) return;

        const destination = item.dataset.page;

        // Special handling for gallery button - scroll to masonry grid
        if (destination === 'gallery') {
            const filterSection = document.querySelector('.filter-section');
            if (filterSection) {
                filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Close mobile menu
            mobileMenu.classList.add('hidden');
            hamburger.classList.remove('active');
            return;
        }

        startTransition(destination);
    });
});

// ===== Gallery System =====
let galleryItems = [];
let galleryLoaded = false;
let currentFilter = 'all';
let portfolioGalleryData = [];

// Worker URL for fetching media list from R2 bucket
const WORKER_URL = 'https://lightwork-media.giordanonate.workers.dev/';

// Parse URL into gallery item format
function parseMediaUrl(url) {
    // Extract path after the R2 base URL
    const path = url.replace(R2_BASE_URL + '/', '');

    // Only process Portfolio-Content items
    if (!path.startsWith('Portfolio-Content/')) return null;

    // Extract category (folder name after Portfolio-Content/)
    const parts = path.replace('Portfolio-Content/', '').split('/');
    const category = parts[0].replace(/-/g, ' '); // Convert dashes to spaces for display
    const fileName = decodeURIComponent(parts[parts.length - 1]);

    // Determine type based on extension
    const isVideo = /\.(mp4|mov)$/i.test(fileName);
    const type = isVideo ? 'video' : 'image';

    // Create alt text
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    const alt = `${category} - ${nameWithoutExt}`;

    return {
        type,
        src: path,
        alt,
        category,
        url // Keep original URL for direct use
    };
}

// Fetch media from Cloudflare Worker
async function fetchMediaFromWorker() {
    try {
        const response = await fetch(WORKER_URL);
        const urls = await response.json();

        // Parse URLs into gallery data format
        portfolioGalleryData = urls
            .map(parseMediaUrl)
            .filter(item => item !== null);

        return portfolioGalleryData;
    } catch (error) {
        console.error('Failed to fetch media from worker:', error);
        return [];
    }
}

function createFilterButtons() {
    const filterButtonsContainer = document.getElementById('filter-buttons');
    if (!filterButtonsContainer) return;

    // Create marquee track
    const marqueeTrack = document.createElement('div');
    marqueeTrack.className = 'filter-marquee-track';

    // Get unique categories and sort alphabetically
    const uniqueCategories = [...new Set(portfolioGalleryData.map(item => item.category))].sort();
    const categories = ['all', ...uniqueCategories];

    // Create first set of buttons
    const firstSet = document.createElement('div');
    firstSet.className = 'filter-buttons-set';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        if (category === 'all') {
            button.classList.add('active');
        }
        button.dataset.filter = category;

        // Create logo image element
        const logo = document.createElement('img');
        const logoFileName = category.toLowerCase().replace(/\s+/g, '-');
        logo.src = `${R2_BASE_URL}/logos/${logoFileName}.svg`;
        logo.alt = category;
        logo.className = 'filter-logo';

        // Add error handler to fall back to text if logo doesn't exist
        logo.onerror = () => {
            logo.style.display = 'none';
            button.textContent = category;
        };

        button.appendChild(logo);

        button.addEventListener('click', (e) => {
            // Update active state on all buttons (including duplicates)
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === category) {
                    btn.classList.add('active');
                }
            });

            // Update filter and reload gallery
            currentFilter = category;
            loadGalleryItems();
        });

        firstSet.appendChild(button);
    });

    // Create duplicate set for seamless loop
    const duplicateSet = firstSet.cloneNode(true);
    duplicateSet.className = 'filter-buttons-set duplicate';

    // Re-attach event listeners to duplicate buttons
    const duplicateButtons = duplicateSet.querySelectorAll('.filter-btn');
    duplicateButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            const category = button.dataset.filter;

            // Update active state on all buttons (including originals)
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === category) {
                    btn.classList.add('active');
                }
            });

            // Update filter and reload gallery
            currentFilter = category;
            loadGalleryItems();
        });
    });

    // Append both sets to marquee track
    marqueeTrack.appendChild(firstSet);
    marqueeTrack.appendChild(duplicateSet);

    // Clear container and add marquee track
    filterButtonsContainer.innerHTML = '';
    filterButtonsContainer.appendChild(marqueeTrack);
}

function loadGalleryItems() {
    const grid = document.getElementById('masonry-grid');
    if (!grid) return;

    // Clear grid first
    grid.innerHTML = '';

    // Determine number of columns based on screen width
    const getColumnCount = () => {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 4; // Desktop: 4 columns like nathangiordano.com
    };

    const columnCount = getColumnCount();

    // Create columns
    const columns = [];
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'masonry-column';
        grid.appendChild(column);
        columns.push(column);
    }

    // Filter data based on currentFilter
    const filteredData = currentFilter === 'all'
        ? portfolioGalleryData
        : portfolioGalleryData.filter(item => item.category === currentFilter);

    // Shuffle items like nathangiordano.com
    const shuffled = [...filteredData].sort(() => 0.5 - Math.random());

    // Distribute items across columns
    shuffled.forEach((item, index) => {
        const columnIndex = index % columnCount;

        const masonryItem = document.createElement('div');
        masonryItem.className = 'masonry-item';

        const wrapper = document.createElement('div');
        wrapper.className = 'media-wrapper';

        // Use full URL if available, otherwise construct from src
        const mediaUrl = item.url || getR2Url(item.src);

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = mediaUrl;
            img.alt = item.alt;
            img.loading = 'lazy';
            wrapper.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.dataset.src = mediaUrl; // Use data-src for lazy loading
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.preload = 'none';
            wrapper.appendChild(video);
        }

        // Add metadata overlay
        const infoOverlay = document.createElement('div');
        infoOverlay.className = 'media-info';

        const projectName = document.createElement('p');
        projectName.className = 'project-name';
        projectName.textContent = item.category;

        const fileName = document.createElement('p');
        fileName.className = 'file-name';
        const srcPath = item.src || item.url.replace(R2_BASE_URL + '/', '');
        fileName.textContent = decodeURIComponent(srcPath.split('/').pop());

        infoOverlay.appendChild(projectName);
        infoOverlay.appendChild(fileName);

        wrapper.appendChild(infoOverlay);
        masonryItem.appendChild(wrapper);
        columns[columnIndex].appendChild(masonryItem);

        // Fade in with delay using Intersection Observer
        setTimeout(() => {
            observeElement(masonryItem);
        }, index * 50);
    });

    galleryLoaded = true;
}

// Intersection Observer for lazy loading and animations
function observeElement(element) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Lazy load video source when it comes into view
                const video = entry.target.querySelector('video');
                if (video && video.dataset.src && !video.src) {
                    video.src = video.dataset.src;
                    video.load();
                }

                // Play video when in view (works for both initial load and scroll back)
                if (video && video.src) {
                    video.play().catch(err => console.log('Video autoplay failed:', err));
                }
            } else {
                // Pause video when out of view to save resources
                const video = entry.target.querySelector('video');
                if (video && video.src) {
                    video.pause();
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px' // Start loading slightly before entering viewport
    });

    observer.observe(element);
}

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Here you would send to your backend
        console.log('Form submitted:', data);
        alert('Thank you for your message! We\'ll get back to you soon.');

        contactForm.reset();
    });
}

// ===== Video Handling =====
const heroVideo = document.querySelector('.hero-video');
const videoContainer = document.querySelector('.video-container');

if (heroVideo && videoContainer) {
    videoContainer.classList.add('loading');

    heroVideo.addEventListener('loadeddata', () => {
        videoContainer.classList.remove('loading');
        heroVideo.play().catch(err => {
            console.log('Video autoplay failed:', err);
        });
    });

    heroVideo.addEventListener('error', (e) => {
        console.error('Video load error:', e);
        videoContainer.classList.remove('loading');
    });
}

// ===== Initialize =====
window.addEventListener('load', async () => {
    // Force video to play if it hasn't started
    if (heroVideo) {
        setTimeout(() => {
            heroVideo.play().catch(err => console.log('Delayed play failed:', err));
        }, 1000);
    }

    // Fetch media from worker, then initialize gallery
    await fetchMediaFromWorker();

    // Initialize filter buttons
    createFilterButtons();

    // Load gallery items on home page
    loadGalleryItems();
});

// Handle browser back button
window.addEventListener('popstate', () => {
    // You can add hash-based routing here if needed
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Cleanup code here if needed
});
