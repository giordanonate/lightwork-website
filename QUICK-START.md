# LightWork Website - Quick Start

## 🚀 Get Running in 3 Steps

### 1. Add Your Hero Video

Copy one of your videos to the Website folder and name it `hero-video.mp4`:

```bash
# From Windows Command Prompt or PowerShell
# Navigate to Website folder first
cd "C:\Users\Nathan Giordano\Desktop\Drive\PROJECTS\LightWork\Website"

# Copy one of your hero videos
copy "..\Light-Work-Hero-1.mp4" "hero-video.mp4"
```

**Available videos:**
- Light-Work-Hero-1.mp4
- Light-Work-Hero-2.mp4
- Light-Work-Hero-3.mp4
- light-work-reel-2024.mp4

### 2. Start Local Server

```bash
# Stay in the Website directory
python -m http.server 8000
```

### 3. Open in Browser

Open: `http://localhost:8000`

---

## ✏️ Quick Customization

### Change Video Source
Edit `index.html` line 77:
```html
<source src="hero-video.mp4" type="video/mp4">
```

### Update Title & Text
Edit `index.html` lines 83-89:
```html
<h1 class="main-title fade-in">Your Title</h1>
<p class="main-subtitle fade-in">Your Subtitle</p>
```

### Add Gallery Images
Edit `script.js` line 164:
```javascript
const sampleGalleryData = [
    { type: 'image', src: '../your-image.png', alt: 'Description' },
    // Add more items...
];
```

### Update Social Links
Edit `index.html` lines 89-100:
```html
<a href="https://twitter.com/yourusername" target="_blank">
<a href="https://instagram.com/yourusername" target="_blank">
```

---

## 📁 File Structure

```
Website/
├── index.html       # Main structure
├── styles.css       # All styling
├── script.js        # Navigation & gallery
├── hero-video.mp4   # Your video (add this!)
└── README.md        # Full documentation
```

---

## 🎨 Styling Tips

### Darken Video for Better Text Contrast

Add to `styles.css` after line 259:

```css
.video-container::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}
```

Then update `.copy-section` z-index from 2 to 3.

### Change Colors

Main colors in `styles.css`:
- Background: `#fff` (white)
- Text: `#333` (dark gray)
- Light text: `#666` (medium gray)
- Hover: `#000` (black)

---

## 🔧 Common Tasks

### Use a Different Video Name

Option 1: Rename your video to `hero-video.mp4`

Option 2: Update `index.html` line 77:
```html
<source src="Work.mp4" type="video/mp4">
```

### Add More Images from LightWork Folder

```javascript
{ type: 'image', src: '../hero-image.png', alt: 'Hero' },
{ type: 'image', src: '../logo250.png', alt: 'Logo' },
{ type: 'image', src: '../funky-logo0150.png', alt: 'Funky' },
```

### Stop Video from Looping

Remove `loop` from `index.html` line 76:
```html
<video class="hero-video" autoplay muted playsinline>
```

---

## 📱 Testing

**Desktop:** Works in all modern browsers
**Mobile:** Touch interactions supported
**Performance:** Video should be under 10MB for fast loading

---

## 🚨 Troubleshooting

**Video not playing?**
- Check file exists: `hero-video.mp4` in Website folder
- Check browser console (F12) for errors
- Try a different video

**Can't start server?**
- Python installed? Run: `python --version`
- Already running? Try port 8001: `python -m http.server 8001`

**Transitions not working?**
- Check browser console for JavaScript errors
- Make sure `script.js` is loading

---

## 📚 Need More Help?

See [README.md](README.md) for complete documentation.

**Ready to launch!** 🎉
