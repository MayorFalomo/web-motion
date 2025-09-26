# 🎬 Animation Builder

A beautiful, interactive tool for creating and previewing web animations with a no-code interface. Built with React, TypeScript, TailwindCSS, and Framer Motion.

![Animation Builder](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-blue) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23.22-purple)

## ✨ Features

- **🎯 Element Selection**: Choose from a variety of mock webpage elements
- **🎨 Animation Presets**: 9+ built-in animation types (fade, slide, scale, rotate, stagger, text-reveal)
- **⚙️ Custom Controls**: Adjust duration, delay, and easing with intuitive sliders
- **📊 Visual Timeline**: See all animations on a timeline with drag-and-drop support
- **▶️ Live Preview**: Play and reset animations in real-time
- **📤 Code Export**: Generate Framer Motion or GSAP code snippets
- **🎨 Beautiful UI**: Modern, clean interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd simulate
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 How to Use

### 1. Select an Element
- Use the dropdown in the sidebar to choose from available elements
- Elements include: Hero Title, Hero Subtitle, Hero Image, CTA Button, Feature Cards, and Stats Numbers

### 2. Choose Animation Type
- Select from 9 animation presets:
  - **Fade In**: Smooth opacity transition
  - **Slide Up/Down/Left/Right**: Directional slide animations
  - **Scale In**: Scale from 0 to 1
  - **Rotate In**: Spin effect with rotation
  - **Stagger Up**: Multiple elements with staggered timing
  - **Text Reveal**: Character-by-character text animation

### 3. Customize Settings
- **Duration**: Adjust animation length (0.1s - 3s)
- **Delay**: Set start delay (0s - 2s)
- **Easing**: Choose from 8 easing options including custom cubic-bezier curves

### 4. Add to Timeline
- Click "Add to Timeline" to add the animation
- View all animations on the visual timeline
- Remove animations by clicking the trash icon

### 5. Preview & Export
- Use "Play" to preview all animations
- Use "Reset" to return elements to original state
- Click "Export Code" to generate Framer Motion or GSAP code

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── MockWebpage.tsx  # Sample webpage with elements
│   ├── ElementSelector.tsx
│   ├── AnimationControls.tsx
│   ├── Timeline.tsx
│   └── ExportModal.tsx
├── context/            # React Context for state management
│   └── AnimationContext.tsx
├── data/              # Mock data and presets
│   └── mockData.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

### State Management
- **React Context**: Global state management for animations
- **useReducer**: Predictable state updates
- **TypeScript**: Full type safety throughout the application

### Animation System
- **Framer Motion**: Primary animation library
- **Preset System**: Predefined animation configurations
- **Timeline Management**: Visual representation of animation timing
- **Code Generation**: Export to Framer Motion or GSAP

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray scale
- **Accent**: Purple gradients
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font**: System UI stack
- **Headings**: Bold weights
- **Body**: Regular weights
- **Code**: Monospace

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Hover states, focus rings
- **Inputs**: Clean borders, focus states
- **Modals**: Backdrop blur, smooth transitions

## 🔧 Customization

### Adding New Animation Presets
1. Edit `src/data/mockData.ts`
2. Add new preset to `animationPresets` array
3. Update the code generation logic in `ExportModal.tsx`

### Adding New Elements
1. Add element to `mockElements` in `src/data/mockData.ts`
2. Add corresponding element to `MockWebpage.tsx`
3. Ensure element has proper ID for targeting

### Styling Customization
- Modify `tailwind.config.js` for theme changes
- Update CSS variables in `src/index.css`
- Customize component styles in individual files

## 📦 Dependencies

### Core
- **React 19.1.1**: UI library
- **TypeScript 5.8.3**: Type safety
- **Vite 7.1.7**: Build tool and dev server

### UI & Styling
- **TailwindCSS 4.1.13**: Utility-first CSS framework
- **Lucide React**: Icon library
- **clsx**: Conditional class names
- **tailwind-merge**: Tailwind class merging

### Animation
- **Framer Motion 12.23.22**: Animation library

## 🚀 Deployment

### Build for Production
```bash
yarn build
# or
npm run build
```

### Preview Production Build
```bash
yarn preview
# or
npm run preview
```

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
```bash
npx netlify deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framer Motion** team for the amazing animation library
- **TailwindCSS** team for the utility-first CSS framework
- **Vite** team for the lightning-fast build tool
- **Lucide** team for the beautiful icon set

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**