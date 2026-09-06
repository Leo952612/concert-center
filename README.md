# Concert Center

Aplicación FullStack para la compra de boletas de conciertos con pagos en línea mediante Wompi (Sandbox UAT). Incluye un flujo completo de 5 pasos (Producto -> Datos -> Resumen -> Resultado -> Volver a tienda) y actualización de stock.

## Tecnologías
- **Frontend:** React, Redux Toolkit, Vite, Tailwind CSS
- **Backend:** NestJS, TypeORM, SQL.js
- **Pagos:** Wompi API (Checkout Web en entorno UAT)

## Despliegue
- **Frontend (Vercel):** https://concert-center.vercel.app
- **Backend (Railway):** https://concert-center-production.up.railway.app

## Modelo de Datos
- **Event:** (id, name, description, price, stock, style, image)
- **Transaction:** (id, reference, status, amount, customer_email, wompi_transaction_id)

## Tests
- **Frontend:** 15 tests con Vitest. Cobertura >94% en líneas.
- **Backend:** 13 tests con Jest. Cobertura >91% en líneas.
- *(Aquí pega las capturas de pantalla de la cobertura del frontend y backend)*

## Seguridad
- Las llaves privadas de la API se manejan exclusivamente en variables de entorno (`.env`), las cuales no se suben al repositorio.