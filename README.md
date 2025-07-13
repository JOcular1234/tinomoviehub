# TinoMovie App

TinoMovie is a full-stack movie discovery and watchlist application built with React (frontend) and Node.js/Express (backend). Users can search for movies, filter by genre/year/rating, view details, add favorites, create custom watchlists, and manage their profile.

## Features

- **User Authentication:** Register and login securely.
- **Movie Search & Filter:** Search movies by title or filter by genre, year, and rating.
- **Movie Details:** View detailed info and add reviews.
- **Favorites:** Add movies to your favorites list.
- **Watchlists:** Create, manage, and add/remove movies from custom watchlists.
- **Profile Management:** Update username and email.
- **Responsive UI:** Built with Tailwind CSS for modern design.
- **Notifications:** Toast messages for feedback.

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Axios, React Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **External API:** [TMDB](https://www.themoviedb.org/) for movie data

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- TMDB API Key

### Setup

#### 1. Backend

```sh
cd backend
npm install
# Configure .env with your MongoDB URI, TMDB API Key, and JWT Secret
npm run dev

### Setup

#### 1. frontend
cd frontend
npm install
npm run dev



Open http://localhost:5173 in your browser.

Folder Structure
backend/
  [index.js](http://_vscodecontentref_/0)
  routes/
  models/
  middleware/
  .env
frontend/
  src/
    components/
    context/
    pages/
    [api.js](http://_vscodecontentref_/1)
  public/
  [index.html](http://_vscodecontentref_/2)

  Environment Variables
See backend/.env for required variables:

MONGODB_URI
TMDB_API_KEY
JWT_SECRET
PORT
License
MIT


Enjoy discovering movies with TinoMovie!


You can edit project name, description, and instructions as needed.