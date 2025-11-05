# Full-Stack React Application

A full-stack web application with React frontend and Node.js/Express backend with user authentication.

## Frontend
- React + Vite
- Components: Signup, Login, Dashboard, Home, About, Services, Contact

## Backend
- Node.js
- Express.js
- MongoDB
- Nodemon for development

## Setup Instructions

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start server: `npm run dev`

### Frontend Setup  
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

### Environment Variables
Create a `.env` file with:
- MongoDB connection string
- JWT secret key
- Port numbers


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
