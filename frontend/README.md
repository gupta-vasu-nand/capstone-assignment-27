# Database Relationships Demo - Frontend

A React application demonstrating four types of database relationships through a clean, interactive UI.

## Relationships Demonstrated

1. **One-to-One**: Person & Passport
   - Each person can have exactly one passport
   - Each passport belongs to exactly one person

2. **One-to-Many**: Customer & Orders
   - One customer can have multiple orders
   - Each order belongs to a single customer

3. **Many-to-One**: Books & Author
   - Many books can be written by one author
   - Each book has one author

4. **Many-to-Many**: Actors & Movies
   - Many actors can act in many movies
   - Many movies can have many actors

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Dependencies

- React
- axios - for API calls

## Configuration

The application expects the backend API to be running on `http://localhost:5000`. 

If your backend runs on a different port, update the API endpoints in the component.

## Running the Application

```bash
npm start
```

The application will start on `http://localhost:3000`

## Features

- Create and manage persons with passports
- Create customers and their orders
- Create authors and their books
- Create actors and movies
- Assign actors to movies (many-to-many relationship)
- View all relationships in real-time

## API Endpoints Used

### One-to-One (Person & Passport)
- `GET /persons` - Fetch all persons
- `POST /persons` - Create a new person
- `POST /persons/:id/passport` - Add passport to a person

### One-to-Many (Customer & Orders)
- `GET /customers` - Fetch all customers
- `POST /customers` - Create a new customer
- `POST /customers/:id/orders` - Add order to customer

### Many-to-One (Authors & Books)
- `GET /authors` - Fetch all authors
- `POST /authors` - Create a new author
- `POST /authors/:id/books` - Add book to author

### Many-to-Many (Actors & Movies)
- `GET /actors` - Fetch all actors
- `POST /actors` - Create a new actor
- `GET /movies` - Fetch all movies
- `POST /movies` - Create a new movie
- `POST /assign` - Assign actor to movie

## Project Structure

```
frontend/
├── src/
│   └── App.js          # Main application component
├── package.json
└── README.md
```

## Styling

The application uses inline styles with a teal-to-dark-teal gradient background and clean white cards for each relationship section.

## Troubleshooting

1. **Backend Connection Error**: Ensure the backend server is running on port 5000
2. **CORS Issues**: Verify CORS is enabled on the backend
3. **Data Not Showing**: Check browser console for API errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)