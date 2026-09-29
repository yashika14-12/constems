# CSV Viewer (MERN)

Upload a CSV file, save it in MongoDB and view it in a table with filters.

## Folder structure

```
backend/
  server.js          express app + mongo connection
  models/Upload.js   mongoose model (file name, columns, rows)
  routes/uploads.js  upload / list / get / delete apis
frontend/
  src/App.jsx              main page, filtering logic
  src/api.js               axios calls
  src/components/
    UploadForm.jsx         choose and upload csv
    FileList.jsx           previously uploaded files
    Filters.jsx            filter input for every column
    DataTable.jsx          table with pagination
```

## How to run

You need Node.js and MongoDB running locally (or change `MONGO_URI` in `backend/.env`).

Backend:

```
cd backend
npm install
cp .env.example .env
npm run dev
```

Runs on http://localhost:5050

Frontend (in another terminal):

```
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Deploy (free)

Database on MongoDB Atlas, backend on Render, frontend on Vercel.

1. **MongoDB Atlas**
   - Create a free M0 cluster and a database user.
   - In Network Access allow `0.0.0.0/0` (Render free tier has no fixed IP).
   - Copy the connection string, e.g. `mongodb+srv://user:pass@cluster.xxx.mongodb.net/csv_viewer`

2. **Backend on Render**
   - New → Web Service → pick this repo.
   - Root directory: `backend`, build command: `npm install`, start command: `npm start`
   - Add env variable `MONGO_URI` with the Atlas string (`PORT` is set by Render).
   - Note the url you get, e.g. `https://constems-api.onrender.com`
   - Free services sleep after ~15 min idle, so the first request after that can take 30-50s.

3. **Frontend on Vercel**
   - In `frontend/vercel.json` replace `YOUR-RENDER-APP.onrender.com` with your Render url and push.
   - New Project → pick this repo, root directory: `frontend` (Vite is detected automatically).
   - `vercel.json` forwards `/api/*` to the backend, so no code change is needed.

## APIs

| Method | Url | Description |
| ------ | --- | ----------- |
| POST | /api/uploads | upload csv (form field name `file`) |
| GET | /api/uploads | list of uploaded files |
| GET | /api/uploads/:id | one file with all rows |
| DELETE | /api/uploads/:id | delete a file |

## Filters

- Columns with 20 or fewer unique values (brand, city, region...) get a dropdown.
- Other columns get a text box that does a "contains" search.
- All filters are applied together, so a row has to match every filter.
