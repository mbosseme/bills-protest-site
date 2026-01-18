# Render.com deployment instructions for full-stack React + Node.js app

## 1. Project Structure

- `/src` — React frontend
- `/server.js` — Node.js/Express backend
- `/package.backend.json` — Backend dependencies
- `/package.json` — Frontend dependencies

## 2. Prepare for Render

### Backend
1. In the Render dashboard, create a new Web Service.
2. Connect your GitHub repo (push this project to GitHub first).
3. Set the root directory to the project root.
4. Set the build command to:
   ```
   npm install --prefix . -f express cors && npm install --prefix .
   ```
5. Set the start command to:
   ```
   node server.js
   ```
6. Set the environment variable `NODE_ENV=production`.

### Frontend
1. In the same repo, set up a separate Render Static Site (or use the same service with a custom build script).
2. Build the frontend:
   ```
   npm run build
   ```
3. Set the publish directory to `dist`.

### Proxy API requests
- In `vite.config.js`, add:
  ```js
  export default {
    // ...existing config
    server: {
      proxy: {
        '/api': 'http://localhost:8080',
      },
    },
  };
  ```
- On Render, set the API URL to your backend service URL.

## 3. Push to GitHub and Deploy
- Commit all files and push to a new GitHub repo.
- Connect both frontend and backend to Render as described above.

## 4. Notes
- Render free tier may sleep after inactivity.
- For persistent storage, consider using a database (Render offers free Postgres).
- For local dev, run `node server.js` and `npm run dev` in separate terminals.

---
For more details, see https://render.com/docs/deploy-node-express-app and https://render.com/docs/deploy-create-react-app
