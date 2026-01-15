# LightWork Website

A modern, interactive portfolio website inspired by nathangiordano.com, featuring full-screen video hero, smooth page transitions, and a responsive masonry gallery.

## Features

### Core Features
- **Entry Page**: Clean "Enter" button landing page
- **Full-Screen Video Hero**: Looping background video with content overlay
- **Smooth Transitions**: Page transition system with white fade overlay (matching nathangiordano.com)
- **Icon Navigation**: Desktop icon-based navigation with hover effects
- **Mobile Responsive**: Hamburger menu for mobile devices
- **Masonry Gallery**: CSS column-based gallery with lazy loading
- **Contact Form**: Functional contact form ready for backend integration

### Technical Details
- Built with vanilla HTML, CSS, and JavaScript (no build tools required)
- Full-screen video background with responsive scaling
- Intersection Observer API for lazy loading
- Mobile-first responsive design
- Roboto Mono font (matching nathangiordano.com)

## File Structure

```
Website/
├── index.html          # Main HTML structure
├── styles.css          # All styling (matches nathangiordano.com aesthetic)
├── script.js           # Navigation, transitions, and gallery logic
├── hero-video.mp4      # Your hero video (add your own)
└── README.md           # This file
```

## Running Locally

### Option 1: Python HTTP Server (Recommended)

Navigate to the website directory:
```bash
cd "C:\Users\Nathan Giordano\Desktop\Drive\PROJECTS\LightWork\Website"
```

Then run:
```bash
# Python 3
python -m http.server 8000

# OR Python 2
python -m SimpleHTTPServer 8000
```

Open your browser to: `http://localhost:8000`

### Option 2: Node.js HTTP Server

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run from the Website directory
http-server -p 8000
```

Open your browser to: `http://localhost:8000`

### Option 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 4: Direct File Access

You can double-click `index.html` to open it directly in your browser. However, some features work better with a local server.

## Setup Your Hero Video

Before running the site, you need to add your hero video:

### Option 1: Use an Existing LightWork Video

You have several videos in your LightWork folder. Copy one to the Website directory:

```bash
# From the Website directory
cp "../Light-Work-Hero-1.mp4" hero-video.mp4
# Or use Hero-2, Hero-3, or any other video
```

Available videos in your LightWork folder:
- `Light-Work-Hero-1.mp4`
- `Light-Work-Hero-2.mp4`
- `Light-Work-Hero-3.mp4`
- `light-work-reel-2024.mp4`
- `ME-About-Build.mp4`
- `Work.mp4`

### Option 2: Use a Different Video

Simply name your video `hero-video.mp4` and place it in the Website directory, or update the video source in `index.html`:

```html
<source src="your-video-name.mp4" type="video/mp4">
```

## Customization Guide

### 1. Update Content

#### Home Section (index.html lines 83-89)
```html
<h1 class="main-title fade-in">LightWork</h1>
<p class="main-subtitle fade-in">Your Subtitle Here</p>

<div class="copy-text fade-in">
    <p>Your first paragraph...</p>
    <p>Your second paragraph...</p>
</div>
```

#### Social Links (index.html lines 88-101)
Update the `href` attributes with your actual social media URLs:
```html
<a href="https://twitter.com/yourusername" target="_blank">
<a href="https://instagram.com/yourusername" target="_blank">
```

### 2. Add Your Gallery Images

Edit `script.js` (lines 164-174) to replace the sample data:

```javascript
const sampleGalleryData = [
    { type: 'image', src: 'path/to/your/image1.jpg', alt: 'Description' },
    { type: 'image', src: 'path/to/your/image2.png', alt: 'Description' },
    { type: 'video', src: 'path/to/your/video.mp4', alt: 'Description' },
    // Add more items...
];
```

**To use local images:**
1. Create an `images` folder in the Website directory
2. Add your images there
3. Reference them as: `src: 'images/yourimage.jpg'`

**To use images from the LightWork folder:**
You have many images available in the parent directory. You can reference them like:
```javascript
{ type: 'image', src: '../hero-image.png', alt: 'Hero' },
{ type: 'image', src: '../logo250.png', alt: 'Logo' },
{ type: 'image', src: '../funky-logo0150.png', alt: 'Funky Logo' },
```

### 3. Customize the Video Hero

#### Change the Video
Replace `hero-video.mp4` with any video file, or update the source in `index.html`:

```html
<video class="hero-video" autoplay muted loop playsinline>
    <source src="your-video.mp4" type="video/mp4">
</video>
```

#### Video Best Practices
- **Resolution**: 1920x1080 (Full HD) or higher
- **Format**: MP4 (H.264 codec) for best browser compatibility
- **File Size**: Keep under 10MB for fast loading (compress if needed)
- **Duration**: 10-30 seconds is ideal for looping backgrounds
- **Aspect Ratio**: 16:9 works best for full-screen display

#### Add Video Overlay/Tint
To darken the video for better text readability, add this to `styles.css`:

```css
.video-container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3); /* Adjust opacity */
    z-index: 1;
}
```

And update copy-section z-index to 2 or higher.

### 4. Change Colors

Main colors are defined in `styles.css`:

- Background: `#fff` (white)
- Text: `#333` (dark gray) and `#666` (medium gray)
- Hover: `#000` (black)

To change the theme, search and replace these colors throughout `styles.css`.

### 5. Modify Navigation Icons

Navigation icons are SVGs in `index.html` (lines 29-55). You can:
- Replace with different SVG icons from [Feather Icons](https://feathericons.com/)
- Add more navigation items by copying the button structure
- Change tooltips by editing the `title` attributes

### 6. About & Contact Content

Update the about text in `index.html` (lines 120-123):
```html
<div class="about-content">
    <p>Your story here...</p>
</div>
```

### 7. Contact Form Backend

The contact form currently shows an alert. To make it functional:

In `script.js` (lines 242-259), replace the alert with an actual backend call:

```javascript
// Example with fetch API
fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
    alert('Message sent successfully!');
    contactForm.reset();
})
.catch(error => {
    alert('Error sending message. Please try again.');
});
```

Or integrate with services like:
- [Formspree](https://formspree.io/)
- [EmailJS](https://www.emailjs.com/)
- [Netlify Forms](https://www.netlify.com/products/forms/)

## Advanced Customization

### Add Three.js Later

If you want to add Three.js visualizations later:

1. Add Three.js CDN before closing `</body>`:
```html
<script src="https://cdn.jsdelivr.net/npm/three@0.177.0/build/three.min.js"></script>
```

2. Create a canvas container
3. Initialize your Three.js scene

You can even overlay Three.js on top of the video or replace it entirely.

### Add More Sections

1. Add the section HTML in `index.html` within `#home-page`
2. Add a navigation icon for it
3. The existing JavaScript will handle the transitions automatically

### Deploy to Production

#### GitHub Pages
1. Create a GitHub repository
2. Push your code
3. Enable GitHub Pages in repository settings
4. Access at: `https://yourusername.github.io/repository-name`

#### Netlify
1. Create a Netlify account
2. Drag and drop the Website folder
3. Get instant deployment with custom domain support

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the Website directory
3. Follow the prompts

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch interactions

## Performance Tips

1. **Optimize Images**: Compress images before adding to gallery
   - Use tools like TinyPNG or ImageOptim
   - Target 200-500KB per image

2. **Lazy Loading**: Already implemented with Intersection Observer

3. **Three.js Performance**:
   - The Earth uses reasonable polygon counts
   - Post-processing can be disabled for better performance on low-end devices

## Troubleshooting

### Video not showing
- Ensure `hero-video.mp4` exists in the Website directory
- Check browser console for 404 errors
- Verify video codec is H.264 (most compatible)
- Try a different video format or compress the file

### Video not autoplaying
- Autoplay with sound is blocked by browsers
- The video is set to `muted` to allow autoplay
- Mobile devices may require user interaction first

### Transitions not working
- Ensure `script.js` is loading
- Check browser console for JavaScript errors

### Images not loading in gallery
- Verify image paths are correct
- Check browser console for 404 errors
- Ensure images are in the correct directory

## Next Steps

1. ✅ Basic structure is complete
2. **Add your hero video** (copy from LightWork folder)
3. Add your actual content and images to gallery
4. Customize colors and fonts if desired
5. Update social media links
6. Connect contact form to backend/service
7. Test on mobile devices
8. Deploy to production

## Upgrading to Next.js Later

When you're ready to add Next.js features:

1. Initialize Next.js: `npx create-next-app@latest`
2. Copy your HTML into Next.js pages
3. Convert CSS to CSS Modules or Tailwind
4. Migrate Three.js to a component
5. Add server-side rendering and API routes

The current structure is designed to make this transition smooth.

## License

This is your personal project. Use it however you'd like!

---

**Questions?** The code is well-commented. Check inline comments for additional details.

**Ready to start customizing!** 🎨
