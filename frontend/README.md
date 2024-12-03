# Getting started

## Mapbox

For the mapbox-gl integration, a Mapbbox-API token is needed. If you don’t yet have an account, create one and get your API token from within your account (https://account.mapbox.com/).

Afterwards create a file called `.env.local` in the root of the `frontend` folder with the following content:

```
VITE_MAPBOX_ACCESS_TOKEN=<your-mapbox-access-token-here>
```

Mapbox offers 50.000 page loads per month for free.

Note: Using React.StrictMode, every component is mounted twice. This is intended behavior and cannot be changed easily. This leads to each page load counting as two page loads for the Mapbox-API.

## Commands

| Command            | Action                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Installs dependencies                        |
| `npm run dev`      | Starts local dev server                      |
| `npm run build`    | Build production site to `./dist/`           |
| `npm run preview`  | Preview build from `./dist/` locally         |
| `npm run prettier` | Reformat all code according to `.prettierrc` |
| `npm run lint`     | Basic linting (default configuration)        |
