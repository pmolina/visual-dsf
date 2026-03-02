# BCRA — Central de Deudores

Look up the debt history of up to 10 Argentine CUITs using the [BCRA Central de Deudores](https://www.bcra.gob.ar/BCRAyVos/Sistemas_de_informacion_u_operativos.asp) public API.

## Features

- Enter up to 10 CUITs (with or without dashes)
- Check digit validation using the official AFIP algorithm
- Parallel requests to the BCRA public API
- Stacked bar chart per CUIT showing debt by entity and period
- Bars with irregular credit status (≥ 2) show a red line on their right edge
- The status badge reflects only the most recent reported period
- Light / dark mode toggle with `localStorage` persistence

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## API

Uses the BCRA public API:

```
GET https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/Historicas/{cuit}
```
