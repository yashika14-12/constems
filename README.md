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

Live at https://constems.vercel.app

- **Database:** MongoDB Atlas free M0 cluster `constems` (AWS Singapore). Network access allows `0.0.0.0/0`.
- **Backend:** Vercel project `constems-api` from `backend/` (https://constems-api.vercel.app).
  `server.js` exports the express app so Vercel can run it as a function. `MONGO_URI` is set in the
  project's environment variables.
- **Frontend:** Vercel project `constems` from `frontend/`. `vercel.json` forwards `/api/*` to the backend.

To redeploy after changes:

```
cd backend && npx vercel deploy --prod
cd frontend && npx vercel deploy --prod
```

Vercel functions accept request bodies up to 4.5 MB, so uploads larger than that fail in production.

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
