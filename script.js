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

// Portfolio gallery data - all media from Portfolio-Content folder with actual file metadata
const portfolioGalleryData = [
    { type: 'image', src: 'Portfolio-Content/Bothead/ANIMATED3.gif', alt: 'Bothead - ANIMATED3', category: 'Bothead', dateModified: '04-26-2022' },
    { type: 'image', src: 'Portfolio-Content/Bothead/BACKDROPS0010.png', alt: 'Bothead - BACKDROPS0010', category: 'Bothead', dateModified: '05-03-2022' },
    { type: 'video', src: 'Portfolio-Content/Bothead/Bothead.mp4', alt: 'Bothead - Bothead', category: 'Bothead', dateModified: '07-12-2022' },
    { type: 'image', src: 'Portfolio-Content/Bothead/CHEESEBOT.png', alt: 'Bothead - CHEESEBOT', category: 'Bothead', dateModified: '04-25-2022' },
    { type: 'image', src: 'Portfolio-Content/Bothead/newannoucment0012.png', alt: 'Bothead - newannoucment0012', category: 'Bothead', dateModified: '07-22-2022' },
    { type: 'image', src: 'Portfolio-Content/Bothead/NICE1.png', alt: 'Bothead - NICE1', category: 'Bothead', dateModified: '04-25-2022' },
    { type: 'image', src: 'Portfolio-Content/Bothead/OG.png', alt: 'Bothead - OG', category: 'Bothead', dateModified: '04-25-2022' },
    { type: 'image', src: 'Portfolio-Content/Bothead/ONEb.png', alt: 'Bothead - ONEb', category: 'Bothead', dateModified: '06-28-2022' },
    { type: 'image', src: 'Portfolio-Content/Bothead/PapaMooMoo.png', alt: 'Bothead - PapaMooMoo', category: 'Bothead', dateModified: '09-23-2022' },
    { type: 'video', src: 'Portfolio-Content/Bothead/Teaser2.mp4', alt: 'Bothead - Teaser2', category: 'Bothead', dateModified: '04-23-2022' },
    { type: 'image', src: 'Portfolio-Content/Bothead/unknown.png', alt: 'Bothead - unknown', category: 'Bothead', dateModified: '07-09-2022' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/3Dtoken1.mp4', alt: 'Degen-Legends - 3Dtoken1', category: 'Degen-Legends', dateModified: '11-02-2022' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/ArtReveal2.mp4', alt: 'Degen-Legends - ArtReveal2', category: 'Degen-Legends', dateModified: '01-31-2023' },
    { type: 'image', src: 'Portfolio-Content/Degen-Legends/banner.gif', alt: 'Degen-Legends - banner', category: 'Degen-Legends', dateModified: '02-02-2023' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/BillBoard2.mp4', alt: 'Degen-Legends - BillBoard2', category: 'Degen-Legends', dateModified: '01-13-2023' },
    { type: 'image', src: 'Portfolio-Content/Degen-Legends/BlackArmorHelmets.png', alt: 'Degen-Legends - BlackArmorHelmets', category: 'Degen-Legends', dateModified: '11-26-2022' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/CityReveal.mp4', alt: 'Degen-Legends - CityReveal', category: 'Degen-Legends', dateModified: '01-19-2023' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/COVER-HAMMER.mp4', alt: 'Degen-Legends - COVER-HAMMER', category: 'Degen-Legends', dateModified: '01-18-2023' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/COVER-HUMANS.mp4', alt: 'Degen-Legends - COVER-HUMANS', category: 'Degen-Legends', dateModified: '01-28-2023' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/FigureTest1.mp4', alt: 'Degen-Legends - FigureTest1', category: 'Degen-Legends', dateModified: '11-13-2022' },
    { type: 'image', src: 'Portfolio-Content/Degen-Legends/hammersample1.png', alt: 'Degen-Legends - hammersample1', category: 'Degen-Legends', dateModified: '01-23-2023' },
    { type: 'image', src: 'Portfolio-Content/Degen-Legends/lightning-bolt-animation-3.gif', alt: 'Degen-Legends - lightning-bolt-animation-3', category: 'Degen-Legends', dateModified: '01-31-2023' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/LOGO5.mp4', alt: 'Degen-Legends - LOGO5', category: 'Degen-Legends', dateModified: '02-21-2023' },
    { type: 'image', src: 'Portfolio-Content/Degen-Legends/MerchAssetsSkull2.gif', alt: 'Degen-Legends - MerchAssetsSkull2', category: 'Degen-Legends', dateModified: '09-29-2022' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/Rotate1.mp4', alt: 'Degen-Legends - Rotate1', category: 'Degen-Legends', dateModified: '01-20-2023' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/ScoreboardAd.mp4', alt: 'Degen-Legends - ScoreboardAd', category: 'Degen-Legends', dateModified: '01-17-2023' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/Skull-Token.mp4', alt: 'Degen-Legends - Skull-Token', category: 'Degen-Legends', dateModified: '02-02-2023' },
    { type: 'video', src: 'Portfolio-Content/Degen-Legends/SPLASH-ANIMATED-1.mp4', alt: 'Degen-Legends - SPLASH-ANIMATED-1', category: 'Degen-Legends', dateModified: '08-24-2022' },
    { type: 'image', src: 'Portfolio-Content/Degen-Legends/Tall-Poster (3).png', alt: 'Degen-Legends - Tall-Poster (3)', category: 'Degen-Legends', dateModified: '11-07-2022' },
    { type: 'image', src: 'Portfolio-Content/Degen-Legends/Twitter-Banner.png', alt: 'Degen-Legends - Twitter-Banner', category: 'Degen-Legends', dateModified: '01-23-2023' },
    { type: 'image', src: 'Portfolio-Content/G-Money/GMONEY-DESIGNFORFLIP1.png', alt: 'G-Money - GMONEY-DESIGNFORFLIP1', category: 'G-Money', dateModified: '08-17-2022' },
    { type: 'image', src: 'Portfolio-Content/G-Money/GMONEY-HIGHSNOBIETY-FISHEYE.png', alt: 'G-Money - GMONEY-HIGHSNOBIETY-FISHEYE', category: 'G-Money', dateModified: '08-21-2022' },
    { type: 'image', src: 'Portfolio-Content/G-Money/GMONEY-HIGHSNOBIETY-SQUARE.png', alt: 'G-Money - GMONEY-HIGHSNOBIETY-SQUARE', category: 'G-Money', dateModified: '08-21-2022' },
    { type: 'image', src: 'Portfolio-Content/G-Money/GMONEY-HIGHSNOBIETY-TALL.png', alt: 'G-Money - GMONEY-HIGHSNOBIETY-TALL', category: 'G-Money', dateModified: '08-21-2022' },
    { type: 'video', src: 'Portfolio-Content/G-Money/GMONEY-VAULT-ANIMATED.mp4', alt: 'G-Money - GMONEY-VAULT-ANIMATED', category: 'G-Money', dateModified: '08-22-2022' },
    { type: 'image', src: 'Portfolio-Content/G-Money/GMONEY10.png', alt: 'G-Money - GMONEY10', category: 'G-Money', dateModified: '08-18-2022' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/$ME-Logo-Loop.mp4', alt: 'Magic Eden - $ME-Logo-Loop', category: 'Magic Eden', dateModified: '10-29-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/2024-Recap-4.mp4', alt: 'Magic Eden - 2024-Recap-4', category: 'Magic Eden', dateModified: '12-13-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/470million-2.mp4', alt: 'Magic Eden - 470million-2', category: 'Magic Eden', dateModified: '12-10-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/BTC-Flower-Scene.mp4', alt: 'Magic Eden - BTC-Flower-Scene', category: 'Magic Eden', dateModified: '04-15-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/BTC-Runes-Texture-Sample.mp4', alt: 'Magic Eden - BTC-Runes-Texture-Sample', category: 'Magic Eden', dateModified: '04-11-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Creator-Confessions-Vertical.mp4', alt: 'Magic Eden - Creator-Confessions-Vertical', category: 'Magic Eden', dateModified: '04-30-2023' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Distribution-Cube.mp4', alt: 'Magic Eden - Distribution-Cube', category: 'Magic Eden', dateModified: '12-10-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Emmy-Close-Up-1.mp4', alt: 'Magic Eden - Emmy-Close-Up-1', category: 'Magic Eden', dateModified: '03-26-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Emmy-Curtis-Dap-Rough.mp4', alt: 'Magic Eden - Emmy-Curtis-Dap-Rough', category: 'Magic Eden', dateModified: '02-07-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Emmy-Wave-3.mp4', alt: 'Magic Eden - Emmy-Wave-3', category: 'Magic Eden', dateModified: '04-26-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Lucky-Buy-Base-3.mp4', alt: 'Magic Eden - Lucky-Buy-Base-3', category: 'Magic Eden', dateModified: '08-29-2025' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/METV-3D-vertical.mp4', alt: 'Magic Eden - METV-3D-vertical', category: 'Magic Eden', dateModified: '05-06-2023' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Runes-Phone.mp4', alt: 'Magic Eden - Runes-Phone', category: 'Magic Eden', dateModified: '01-30-2025' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Season-2-1.mp4', alt: 'Magic Eden - Season-2-1', category: 'Magic Eden', dateModified: '03-24-2025' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Surfing-2.mp4', alt: 'Magic Eden - Surfing-2', category: 'Magic Eden', dateModified: '11-12-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Top-1-Loop.mp4', alt: 'Magic Eden - Top-1-Loop', category: 'Magic Eden', dateModified: '03-29-2025' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Wallet-GA-Token-Claim.mp4', alt: 'Magic Eden - Wallet-GA-Token-Claim', category: 'Magic Eden', dateModified: '08-21-2024' },
    { type: 'video', src: 'Portfolio-Content/Magic Eden/Yuga-Teaser-V6.mp4', alt: 'Magic Eden - Yuga-Teaser-V6', category: 'Magic Eden', dateModified: '10-27-2023' },
    { type: 'video', src: 'Portfolio-Content/Mango Markets/loop-de-loop-3.mp4', alt: 'Mango Markets - loop-de-loop-3', category: 'Mango Markets', dateModified: '10-19-2023' },
    { type: 'video', src: 'Portfolio-Content/Mango Markets/Mango-Island.mp4', alt: 'Mango Markets - Mango-Island', category: 'Mango Markets', dateModified: '12-01-2023' },
    { type: 'video', src: 'Portfolio-Content/Mango Markets/Mango-Test-1.mp4', alt: 'Mango Markets - Mango-Test-1', category: 'Mango Markets', dateModified: '09-26-2023' },
    { type: 'video', src: 'Portfolio-Content/Mango Markets/Mango-Test-2.mp4', alt: 'Mango Markets - Mango-Test-2', category: 'Mango Markets', dateModified: '09-27-2023' },
    { type: 'video', src: 'Portfolio-Content/Outpace/Baggage-3.mp4', alt: 'Outpace - Baggage-3', category: 'Outpace', dateModified: '09-01-2025' },
    { type: 'video', src: 'Portfolio-Content/Outpace/Baggage-Tall.mp4', alt: 'Outpace - Baggage-Tall', category: 'Outpace', dateModified: '09-02-2025' },
    { type: 'video', src: 'Portfolio-Content/Outpace/PokeBall-6.mp4', alt: 'Outpace - PokeBall-6', category: 'Outpace', dateModified: '09-30-2025' },
    { type: 'image', src: 'Portfolio-Content/Riddle/desert-2.png', alt: 'Riddle - desert-2', category: 'Riddle', dateModified: '03-05-2024' },
    { type: 'image', src: 'Portfolio-Content/Riddle/desert.png', alt: 'Riddle - desert', category: 'Riddle', dateModified: '03-05-2024' },
    { type: 'image', src: 'Portfolio-Content/Riddle/Floating-Car0021.png', alt: 'Riddle - Floating-Car0021', category: 'Riddle', dateModified: '02-16-2024' },
    { type: 'video', src: 'Portfolio-Content/Riddle/Prisoners-V3.mp4', alt: 'Riddle - Prisoners-V3', category: 'Riddle', dateModified: '08-21-2024' },
    { type: 'image', src: 'Portfolio-Content/Riddle/Riddle-Chair-12.png', alt: 'Riddle - Riddle-Chair-12', category: 'Riddle', dateModified: '03-08-2024' },
    { type: 'video', src: 'Portfolio-Content/Riddle/Riddle-Sherf-1.mp4', alt: 'Riddle - Riddle-Sherf-1', category: 'Riddle', dateModified: '02-17-2024' },
    { type: 'video', src: 'Portfolio-Content/Riddle/Riddle-Sherf-7.mp4', alt: 'Riddle - Riddle-Sherf-7', category: 'Riddle', dateModified: '03-02-2024' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/D3-2.png', alt: 'Slingshot - D3-2', category: 'Slingshot', dateModified: '02-14-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/D3-3.png', alt: 'Slingshot - D3-3', category: 'Slingshot', dateModified: '02-15-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/D3_0014.png', alt: 'Slingshot - D3_0014', category: 'Slingshot', dateModified: '02-16-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/D3_0141.png', alt: 'Slingshot - D3_0141', category: 'Slingshot', dateModified: '02-19-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/Press-1.png', alt: 'Slingshot - Press-1', category: 'Slingshot', dateModified: '04-09-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/Press-2.png', alt: 'Slingshot - Press-2', category: 'Slingshot', dateModified: '04-09-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/Press-3.png', alt: 'Slingshot - Press-3', category: 'Slingshot', dateModified: '04-09-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/Rock-1_0008.png', alt: 'Slingshot - Rock-1_0008', category: 'Slingshot', dateModified: '04-06-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/Slingshot-Banner-1500x500.png', alt: 'Slingshot - Slingshot-Banner-1500x500', category: 'Slingshot', dateModified: '04-07-2025' },
    { type: 'video', src: 'Portfolio-Content/Slingshot/Slingshot-Logo-Chrome-Lasers.mp4', alt: 'Slingshot - Slingshot-Logo-Chrome-Lasers', category: 'Slingshot', dateModified: '04-15-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/Slingshot_Banner_0002.png', alt: 'Slingshot - Slingshot_Banner_0002', category: 'Slingshot', dateModified: '04-05-2025' },
    { type: 'video', src: 'Portfolio-Content/Slingshot/Slingshot_Website-1.mp4', alt: 'Slingshot - Slingshot_Website-1', category: 'Slingshot', dateModified: '04-11-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/V1-1_0003.png', alt: 'Slingshot - V1-1_0003', category: 'Slingshot', dateModified: '02-25-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/V1-1_0004.png', alt: 'Slingshot - V1-1_0004', category: 'Slingshot', dateModified: '02-25-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/V1-1_0092.png', alt: 'Slingshot - V1-1_0092', category: 'Slingshot', dateModified: '03-12-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/V1-2_0001.png', alt: 'Slingshot - V1-2_0001', category: 'Slingshot', dateModified: '03-12-2025' },
    { type: 'image', src: 'Portfolio-Content/Slingshot/V1-2_0113.png', alt: 'Slingshot - V1-2_0113', category: 'Slingshot', dateModified: '03-12-2025' },
    { type: 'image', src: 'Portfolio-Content/Thunk/3D-21.png', alt: 'Thunk - 3D-21', category: 'Thunk', dateModified: '04-13-2023' },
    { type: 'image', src: 'Portfolio-Content/Thunk/graffiti-9.png', alt: 'Thunk - graffiti-9', category: 'Thunk', dateModified: '04-13-2023' },
    { type: 'image', src: 'Portfolio-Content/Thunk/Talking-Businessly.PNG', alt: 'Thunk - Talking-Businessly', category: 'Thunk', dateModified: '08-16-2023' },
    { type: 'image', src: 'Portfolio-Content/Thunk/Thunk-1.png', alt: 'Thunk - Thunk-1', category: 'Thunk', dateModified: '04-17-2023' },
    { type: 'image', src: 'Portfolio-Content/Thunk/ThunkSceneV2.png', alt: 'Thunk - ThunkSceneV2', category: 'Thunk', dateModified: '01-11-2026' },
    { type: 'image', src: 'Portfolio-Content/Thunk/Verbs-2000x2000-Still-Small.png', alt: 'Thunk - Verbs-2000x2000-Still-Small', category: 'Thunk', dateModified: '11-14-2023' },
    { type: 'video', src: 'Portfolio-Content/Thunk/Verbs-Animated.mp4', alt: 'Thunk - Verbs-Animated', category: 'Thunk', dateModified: '10-25-2023' },
    { type: 'video', src: 'Portfolio-Content/Thunk/verbs-header-animated.mp4', alt: 'Thunk - verbs-header-animated', category: 'Thunk', dateModified: '11-15-2023' },
    { type: 'image', src: 'Portfolio-Content/Thunk/verbs-header-still.png', alt: 'Thunk - verbs-header-still', category: 'Thunk', dateModified: '11-15-2023' },
    { type: 'video', src: 'Portfolio-Content/Zo/Booting-Up-Screen.mp4', alt: 'Zo - Booting-Up-Screen', category: 'Zo', dateModified: '12-05-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/Code0000.png', alt: 'Zo - Code0000', category: 'Zo', dateModified: '10-13-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/Now-on-Windows.png', alt: 'Zo - Now-on-Windows', category: 'Zo', dateModified: '12-04-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/Pixel.png', alt: 'Zo - Pixel', category: 'Zo', dateModified: '12-04-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/Shot-3_0031.png', alt: 'Zo - Shot-3_0031', category: 'Zo', dateModified: '09-29-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/Zo-Blue.png', alt: 'Zo - Zo-Blue', category: 'Zo', dateModified: '12-07-2025' },
    { type: 'video', src: 'Portfolio-Content/Zo/Zo-Coin-White.mp4', alt: 'Zo - Zo-Coin-White', category: 'Zo', dateModified: '01-05-2026' },
    { type: 'video', src: 'Portfolio-Content/Zo/Zo-Light-Dark-Mode-Rough.mp4', alt: 'Zo - Zo-Light-Dark-Mode-Rough', category: 'Zo', dateModified: '10-15-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/Zo-Pilled.png', alt: 'Zo - Zo-Pilled', category: 'Zo', dateModified: '12-05-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/Zo-Sweater.png', alt: 'Zo - Zo-Sweater', category: 'Zo', dateModified: '12-09-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/ZoIcons0033.png', alt: 'Zo - ZoIcons0033', category: 'Zo', dateModified: '10-17-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/ZoIcons0034.png', alt: 'Zo - ZoIcons0034', category: 'Zo', dateModified: '10-17-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/ZoIcons0093.png', alt: 'Zo - ZoIcons0093', category: 'Zo', dateModified: '10-16-2025' },
    { type: 'image', src: 'Portfolio-Content/Zo/ZoIcons0094.png', alt: 'Zo - ZoIcons0094', category: 'Zo', dateModified: '10-16-2025' },
    { type: 'video', src: 'Portfolio-Content/Light Work/Again.mp4', alt: 'Light Work - Again', category: 'Light Work', dateModified: '01-11-2026' },
    { type: 'video', src: 'Portfolio-Content/Light Work/Being-35-Widescreen.mp4', alt: 'Light Work - Being-35-Widescreen', category: 'Light Work', dateModified: '01-11-2026' },
    { type: 'video', src: 'Portfolio-Content/Light Work/Being-39.mp4', alt: 'Light Work - Being-39', category: 'Light Work', dateModified: '01-11-2026' },
    { type: 'video', src: 'Portfolio-Content/Light Work/Breathe.mp4', alt: 'Light Work - Breathe', category: 'Light Work', dateModified: '01-11-2026' },
    { type: 'video', src: 'Portfolio-Content/Light Work/Crystal-Castles.mp4', alt: 'Light Work - Crystal-Castles', category: 'Light Work', dateModified: '01-11-2026' },
    { type: 'video', src: 'Portfolio-Content/Light Work/Fairy, she can dance..mp4', alt: 'Light Work - Fairy, she can dance', category: 'Light Work', dateModified: '01-11-2026' },
    { type: 'video', src: 'Portfolio-Content/Light Work/Fairy.mp4', alt: 'Light Work - Fairy', category: 'Light Work', dateModified: '01-11-2026' },
    { type: 'video', src: 'Portfolio-Content/Light Work/Flag-is-raised.mp4', alt: 'Light Work - Flag-is-raised', category: 'Light Work', dateModified: '01-11-2026' },
    { type: 'video', src: 'Portfolio-Content/Light Work/God.mp4', alt: 'Light Work - God', category: 'Light Work', dateModified: '01-11-2026' }
];

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
        logo.src = `logos/${logoFileName}.svg`;
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

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = getR2Url(item.src);
            img.alt = item.alt;
            img.loading = 'lazy';
            wrapper.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.dataset.src = getR2Url(item.src); // Use data-src for lazy loading
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
        fileName.textContent = item.src.split('/').pop();

        const dateModified = document.createElement('p');
        dateModified.className = 'date-modified';
        dateModified.textContent = item.dateModified;

        infoOverlay.appendChild(projectName);
        infoOverlay.appendChild(fileName);
        infoOverlay.appendChild(dateModified);

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
window.addEventListener('load', () => {
    // Force video to play if it hasn't started
    if (heroVideo) {
        setTimeout(() => {
            heroVideo.play().catch(err => console.log('Delayed play failed:', err));
        }, 1000);
    }

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
