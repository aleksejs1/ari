# Ari Landing Page

The official landing page for the **Ari** personal CRM project.
This is a modern, responsive website built to showcase the features and philosophy of Ari.

## 🛠 Technologies Used

- **[React](https://react.dev/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool and development server
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework (configured with `@tailwindcss/vite` plugin)
- **[Lucide React](https://lucide.dev/)** - Icon set
- **HTML5 Canvas** - Custom particle connection background effect

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js installed (v18+ recommended).

### Installation

1. Navigate to the project directory:
   ```bash
   cd ari-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### 💻 Development

Start the development server with hot reload:

```bash
npm run dev
```

Visit `http://localhost:5173` to view the site.

### 🏗 Building for Production

Create a production-ready build:

```bash
npm run build
```

This will generate a `dist` folder containing the compiled assets (HTML, CSS, JS) suitable for deployment to any static hosting service (GitHub Pages, Vercel, Netlify, Nginx, etc.).

### 📁 Project Structure

- `src/components/ConnectionBackground.jsx` - The interactive canvas background animation.
- `src/App.jsx` - Main page structure and content.
- `src/index.css` - Tailwind imports and custom animations.
- `public/assets` - Images (screenshots, logo).
