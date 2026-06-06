# Smart Store Navigator using Dijkstra's Algorithm

## Project Overview
The Smart Store Navigator is an academic project for Analysis and Design of Algorithms (ADA). It is a modern web application that helps customers find products inside a store by calculating and displaying the shortest path from the entrance to the selected product using Dijkstra's Algorithm.

This is a prototype indoor navigation system intended to demonstrate graph modeling, shortest path computation, and algorithm statistics in a beginner-friendly, visual manner.

## Features
- **Interactive Store Map**: Visual representation of the store layout with entrances, shelves, and walkable paths.
- **Path Navigation**: Calculates and animates the shortest route to any product.
- **Admin Panel**: Manage the store's product inventory with Authentication (Code: BCS401).
- **Product Zones**: Organize inventory categorically using custom-defined Zones and Rack Types.
- **Algorithm Statistics**: Displays the distance, nodes visited, path cells, and time complexity in real-time.
- **Array-Based Dijkstra**: The algorithm is specifically implemented using basic arrays to meet educational requirements.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Algorithm Layer**: C++ (for local/ADA demo) & JavaScript (for deployment)

## Setup and Installation Steps

### Prerequisites
- Node.js (v18+)
- C++ Compiler (`g++` must be available in your system PATH)

### 1. Algorithm Compilation (Optional but recommended)
```bash
cd algorithm
g++ dijkstra.cpp -o dijkstra
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend will run on `http://localhost:3000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## API Documentation
- `GET /api/inventory/stats`: Get dashboard statistics
- `GET /api/products/suggestions?q=`: Get autocomplete suggestions
- `GET /api/products`: Retrieve all products
- `POST /api/products`: Add a new product
- `PUT /api/products/:name`: Update or relocate a product
- `DELETE /api/products/:name`: Delete a product
- `POST /api/products/import`: Import products array
- `POST /api/find-route`: Find the shortest route (expects `{ start: [r, c], end: [r, c] }`)
- `POST /api/verify-admin`: Verify Subject Code `BCS401`.

## Viva Justification
**Why Dijkstra?**
- It finds the absolute shortest path for unweighted or positive-weighted graphs.
- Highly suitable for navigation problems where the distance cost is uniform (1 step).

**Why Arrays Instead of Priority Queue?**
- Small graph size (10x10 matrix has only 100 nodes).
- O(V²) complexity is highly acceptable and runs in less than a millisecond for this grid size.
- Much easier to implement, trace, and explain during a viva evaluation.

**Why Matrix Representation?**
- Closely resembles actual store layouts (grids of aisles and shelves).
- Direct mapping of coordinates `(row, col)` to physical positions.

## Key Concepts Demonstrated
- **Graph Representation**: Converting a 2D matrix into an implicit graph.
- **Dijkstra Algorithm**: Implementing shortest-path logic without standard libraries to showcase core fundamental logic.
- **Path Reconstruction**: Backtracking parent arrays to formulate step-by-step route coordinates.
- **Matrix Based Navigation**: Handling constraints, grid coordinates, and obstacles algorithmically.
- **Route Optimization**: Demonstrating distance minimization for retail navigation.
- **Full Stack Development**: Connecting a native C++ backend to a modern React frontend via REST APIs.
- **React**: Utilizing Framer Motion, Context, LocalStorage, and component architectures.
- **Node.js**: Using child_process for executing compiled binaries securely.
- **C++**: Providing performance-critical logic.

## Inventory Reliability Justification
Only authorized users with the subject authentication code (`BCS401`) can access the Admin Dashboard and modify product locations. Customers can freely search products and generate routes, but they cannot alter inventory information. This architecture strictly improves inventory reliability and prevents accidental modification of product locations or configuration data.

## Algorithm Fallback Mode
For robust deployment, the application supports two algorithmic environments controlled by the `.env` file:
- `ALGORITHM_MODE=cpp`: (Default) Uses `child_process` to execute the native C++ binary, perfect for local development and academic evaluation.
- `ALGORITHM_MODE=js`: Bypasses C++ and uses a 1:1 JavaScript replica of the array-based Dijkstra's algorithm. This is designed for production serverless deployments (like Vercel or Render) where native compilation steps might be restricted or unsupported.
