# AI-Powered E-Commerce Frontend

This directory contains the React.js Single Page Application (SPA) for the AI-Powered E-Commerce platform. It serves as the primary user interface for customers to browse products, manage their cart, and checkout, while also providing a personalized experience driven by the backend Machine Learning service.

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (Auth & Cart state)
- **Routing**: React Router DOM
- **API Communication**: Axios

## Key Features

- **Seamless Authentication**: Full JWT-based auth flow including OAuth (Google, GitHub, LinkedIn) support.
- **Personalized Dashboard**: User-specific orders, wishlist, and profile management.
- **AI Recommendations**: Real-time product suggestions based on user behavior (powered by the backend ML service).
- **Responsive Design**: Fully mobile-responsive, modern layouts built with Tailwind CSS.

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine.

### Installation & Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will be available at `http://localhost:5173`.

## Folder Structure

- `src/assets/`: Static files like images and icons.
- `src/component/`: Reusable UI components (Navbar, Footer, ProductCard, ProtectedRoute, etc.).
- `src/hooks/`: Custom React hooks (e.g., `useProducts`, `useAnalytics`).
- `src/pages/`: Main route view components (Home, Dashboard, Login, Register, etc.).
- `src/services/`: API configuration and Redux slices (`authSlice`, `cartSlice`).
- `src/store/`: Global Redux store configuration.

## System Architecture

This frontend is designed to run alongside the Node.js backend and the Python FastAPI Machine Learning service. 

For full system architecture details and backend setup instructions, please refer to the [Root README](../README.md).
