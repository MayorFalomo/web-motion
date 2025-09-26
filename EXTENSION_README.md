# 🎬 Animation Builder Chrome Extension

A Chrome extension that allows you to prototype and preview animations on any website before writing code.

## 🚀 Features

- **🎯 Element Selection**: Click on any element on any webpage to select it
- **🎨 Animation Presets**: 9+ built-in animation types (fade, slide, scale, rotate, stagger, text-reveal)
- **⚙️ Custom Controls**: Adjust duration, delay, and easing with intuitive sliders
- **📊 Visual Timeline**: See all animations on a timeline with drag-and-drop support
- **▶️ Live Preview**: Play and reset animations in real-time on the actual webpage
- **📤 Code Export**: Generate Framer Motion or GSAP code snippets

## 🛠️ Installation

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd simulate
   yarn install
   ```

2. **Build the extension**
   ```bash
   yarn build:extension
   ```

3. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Production Build

1. **Build for production**
   ```bash
   yarn build:extension
   ```

2. **Zip the dist folder** for Chrome Web Store submission

## 🎮 How to Use

### 1. Install the Extension
- Load the extension in Chrome (see installation steps above)
- The extension icon will appear in your browser toolbar

### 2. Open the Extension
- Click the extension icon to open the popup
- The extension will automatically scan the current webpage for elements

### 3. Select Elements
- Click "Select Element" to enter selection mode
- Click on any element on the webpage to select it
- The element will be highlighted and added to the dropdown

### 4. Create Animations
- Choose an animation type from the dropdown
- Adjust duration, delay, and easing settings
- Click "Add to Timeline" to add the animation

### 5. Preview & Export
- Use "Play" to preview all animations on the webpage
- Use "Reset" to return elements to their original state
- Click "Export" to generate Framer Motion or GSAP code

## 🏗️ Architecture

### Extension Structure
```
dist/
├── manifest.json          # Extension manifest
├── popup.html             # Extension popup interface
├── popup.js               # React app bundle
├── content.js             # Content script
├── content.css            # Content script styles
├── injected.js            # Injected script
└── icons/                 # Extension icons
```

### Key Components
- **Popup**: React-based interface for animation controls
- **Content Script**: Manages element selection and page interaction
- **Injected Script**: Handles actual animation execution on the page
- **Background Script**: Manages extension lifecycle

### Communication Flow
1. **Popup ↔ Content Script**: Via Chrome messaging API
2. **Content Script ↔ Injected Script**: Via window.postMessage
3. **Injected Script ↔ Page**: Direct DOM manipulation

## 🎨 Animation Types

- **Fade In**: Smooth opacity transition
- **Slide Up/Down/Left/Right**: Directional slide animations
- **Scale In**: Scale from 0 to 1
- **Rotate In**: Spin effect with rotation
- **Stagger Up**: Multiple elements with staggered timing
- **Text Reveal**: Character-by-character text animation

## 🔧 Customization

### Adding New Animation Types
1. Edit `src/data/mockData.ts` to add new presets
2. Update the animation logic in `public/injected.js`
3. Add corresponding CSS animations in `public/content.css`

### Styling Customization
- Modify `src/index.css` for popup styling
- Update `public/content.css` for page overlay styling
- Customize TailwindCSS theme in `tailwind.config.js`

## 🚀 Deployment

### Chrome Web Store
1. Build the extension: `yarn build:extension`
2. Zip the `dist` folder
3. Upload to Chrome Web Store Developer Dashboard
4. Fill out store listing and submit for review

### Manual Distribution
1. Build the extension: `yarn build:extension`
2. Zip the `dist` folder
3. Share the zip file for manual installation

## 🐛 Troubleshooting

### Common Issues

**Extension not loading**
- Check that all files are in the `dist` folder
- Verify `manifest.json` is valid
- Check Chrome console for errors

**Element selection not working**
- Ensure the page has finished loading
- Check that the content script is injected
- Verify permissions in manifest.json

**Animations not playing**
- Check that the injected script is loaded
- Verify element selectors are correct
- Check browser console for errors

### Debug Mode
- Open Chrome DevTools
- Check Console tab for error messages
- Use Sources tab to debug scripts
- Check Extensions page for permission issues

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Framer Motion** team for the amazing animation library
- **TailwindCSS** team for the utility-first CSS framework
- **Chrome Extensions** team for the powerful extension API

---

**Built with ❤️ for designers and developers who want to prototype animations quickly.**
