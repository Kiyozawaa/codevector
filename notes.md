## What I chose and why
- Used PostgreSQL hosted on Neon because the dataset size (~200,000 products) and filtering/pagination requirements fit a relational database well and SQL databases are well-suited for structured relational data and would make it easier to expand the project with additional related tables in the future.
- Switched to batch inserts during seeding to reduce the overhead of executing hundreds of thousands of individual INSERT statements. Network latency also played a part in this switch up.
- Implemented cursor-based pagination instead of OFFSET/LIMIT pagination to prevent duplicate or missing products when data changes while users are browsing.
- Ordered products using `created_at DESC, id DESC` to ensure a stable ordering even when multiple products share the same timestamp.
- Added database indexes to support filtering and pagination queries efficiently.
- Generated a synthetic dataset of approximately 200,000 products to test the application's behavior at the required scale.
- Kept the frontend intentionally simple and focused on demonstrating the backend functionality.


## What I'd improve with time

- Add search functionality alongside category filtering
- Currently the category filter is hard coded to the webpage. With more time, I would change this to fetch the categories from the database and create the filters automatically.
- Improve the UI and overall user experience.
- Add loading states, error handling, and empty-state messages.
- Refactor query logic into a dedicated service/repository layer for better maintainability.


## How I used AI
- Used AI primarily as a learning and debugging assistant rather than as a code generator.
- To understand PostgreSQL batch inserts, indexing, deployment considerations, and cursor pagination.
- To review implementation ideas and discuss tradeoffs between different approaches.
- Used AI for small UI and CSS suggestions since the focus of the project was backend development.
- Also used it to help structure documentation and this project note.


## Things AI got wrong
- Initially AI suggested OFFSET/LIMIT pagination, but after reviewing the requirement about data changing, I switched to cursor-based pagination which was also suggested by AI later on.
- AI-generated code snippets occasionally needed debugging, especially around query parameters and cursor handling.
- AI sometimes read the console.time() logs wrong.