# Catalog Project
A product catalog application built with Node.js, Express, PostgreSQL and Neon.

Dataset size: ~200,000 products.

## Features
- Newest-first sorting
- Category filtering
- Cursor-based pagination
- Indexed queries

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- Neon
- HTML
- CSS
- Javascript


## Setup
1. Install dependencies
```npm install```

2. Create a `.env` file
```
PORT=<optional>
DB_URL=<your_db_connection_string>
```

3. Seed the database
```npm run seed```

4. Start the server
```npm start```

5. Open 
```http://localhost:8000```