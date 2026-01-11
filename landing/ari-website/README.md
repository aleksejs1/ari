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

### 🐳 Production Deployment (Docker)

The project includes a production-ready Docker setup using a multi-stage build (Node.js build -> Nginx Alpine serve).

#### 1. Configuration (Optional)

The application listens on port `3000` by default. You can change this by creating a `.env` file or setting the environment variable in your shell.

Copy the example configuration:
```bash
cp .env.prod.example .env
```

Edit `.env` and set your desired port:
```ini
PORT=8080
```

#### 2. Build and Run

Run the application using Docker Compose:

```bash
docker-compose up -d --build
```

The site will be available at `http://localhost:3000` (or your configured port).
The final image is based on `nginx:alpine` and is highly optimized for size and performance.
