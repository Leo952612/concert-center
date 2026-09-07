# Concert Center Frontend

Aplicación SPA (Single Page Application) construida con **React, Vite, Redux Toolkit y Tailwind CSS** para la compra de boletas de conciertos. Se comunica con el backend de NestJS para obtener los eventos y procesar los pagos.

## Tecnologías
- **React 18** (UI)
- **Vite** (Build tool)
- **Redux Toolkit** (Manejo de estado global)
- **Tailwind CSS** (Estilos)
- **React Router DOM** (Navegación)

## Estructura del Proyecto
```text
src/
├── components/        # (Reservado para componentes reutilizables)
├── config/
│   └── constants.js   # Variables globales (API_URL, tarifas, categorías)
├── pages/
│   ├── ProductPage/   # Lista de eventos
│   ├── PaymentPage/   # Datos de entrega
│   ├── SummaryPage/   # Resumen y pago
│   └── ResultPage/    # Resultado final
├── store/
│   └── slices/        # Lógica de Redux (cart, product, transaction)
├── App.jsx            # Definición de rutas
└── main.jsx           # Configuración inicial

## Correr el proyecto concert-center-frontend
- **npm run dev** (Inicia el servidor de desarrollo.)
- **npx vitest run** (Ejecuta los tests de la aplicación.)

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
