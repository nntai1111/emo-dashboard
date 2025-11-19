# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Components Structure (Atomic Design)

This project uses Atomic Design to organize UI components:

- Atoms: Smallest building blocks (buttons, inputs, icons)
- Molecules: Simple combinations of atoms (search bar, card header)
- Organisms: Complex, distinct sections (nav bar, cards list)
- Templates: Page-level layouts defining structure without real content
- Pages: Templates with real data, routing entries

Conventions:

- Each component has its own folder with index.jsx|tsx and styles if needed.
- Co-locate tests next to components: ComponentName.test.jsx
- Export components from an index.js in each tier for simpler imports.

Example import:
import Button from "@/components/atoms/Button";

Tip: Create re-exports to shorten import paths.
