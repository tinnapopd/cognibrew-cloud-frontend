# React + TypeScript + Vite

The frontend is built with 
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com/)

## Requirements

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/)

## Quick Start

```bash
bun install
bun run dev
```

* Then open your browser at http://localhost:5173/.

Notice that this live server is not running inside Docker, it's for local development, and that is the recommended workflow. Once you are happy with your frontend, you can build the frontend Docker image and start it, to test it in a production-like environment. But building the image at every change will not be as productive as running the local development server with live reload.

Check the file `package.json` to see other available options.

## Using a Remote API

If you want to use a remote API, you can set the environment variable `VITE_API_URL` to the URL of the remote API. For example, you can set it in the `.env` file:

```env
VITE_API_URL=https://api.my-domain.example.com
```

Then, when you run the frontend, it will use that URL as the base URL for the API.

## Code Structure

The frontend code is structured as follows:

* `src` - The main frontend code.
* `src/assets` - Static assets.
* `src/client` - The generated OpenAPI client.
* `src/components` -  The different components of the frontend.
* `src/hooks` - Custom hooks.
* `src/routes` - The different routes of the frontend which include the pages.

## Testing with Playwright

To update the tests, navigate to the `tests` directory and modify the existing test files or add new ones as needed.

For more information on writing and running Playwright tests, refer to the official [Playwright documentation](https://playwright.dev/docs/intro).

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
