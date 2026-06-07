# Store Navigator using Dijkstra's Algorithm

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

## Challenges Faced
- **Grid Mapping to Graph Structure**: Translating a 2D matrix (where cells represent both nodes and edges) into a format suitable for Dijkstra's algorithm required careful handling of coordinate boundaries and obstacle detection (shelves).
- **Frontend-Backend Algorithm Syncing**: Ensuring that the route output from the native C++ binary matches the expectations of the JavaScript frontend precisely via stdout parsing.
- **Sequential Path Animation**: Animating the calculated shortest path smoothly on the React frontend without causing rendering bottlenecks required a state-driven approach tied to frame-by-frame coordinate mapping.
- **Handling Native Executables**: Dealing with platform-specific execution (`.exe` on Windows vs. Linux binaries) when bridging Node.js and C++. This was resolved by creating a JavaScript fallback mode.

## Viva Justification
**Why Dijkstra?**
- It finds the absolute shortest path for unweighted or positive-weighted graphs.
- Highly suitable for navigation problems where the distance cost is uniform (1 step).

## Array vs. Priority Queue Dijkstra

**Why Arrays Instead of Priority Queue?**
- **Educational Scope**: A core objective was to demonstrate the fundamental mechanics of node relaxation and extraction from scratch without abstracting logic behind standard libraries like `std::priority_queue`.
- **Graph Size constraint**: The store grid size is fixed and relatively small (e.g., 10x10 matrix yields only 100 nodes).
- **Simplicity & Traceability**: Finding the minimum distance vertex in a simple linear loop is much easier to implement, trace, and explain during a viva evaluation.

**Performance Comparison**
| Feature | Array-Based Dijkstra | Priority Queue Dijkstra (Min-Heap) |
| :--- | :--- | :--- |
| **Time Complexity** | `O(V²)` where V is the number of vertices. | `O((V + E) log V)` where E is the number of edges. |
| **Space Complexity** | `O(V)` auxiliary space for distance arrays. | `O(V)` for the priority queue and distance arrays. |
| **Best Use Case** | Dense graphs where `E` approaches `V²`, or very small graphs. | Sparse graphs where `E` is much less than `V²`, and large-scale maps. |
| **Real-World Impact** | For `V = 100` nodes, `V² = 10,000` operations. This runs in `< 1ms` on modern CPUs, making the overhead of maintaining a heap structure unnecessary for this specific scale. |

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

##  Authors 
**SAMRIDH RAJ** 
**/SATWIK RAJ**
**/SURYA GAUTAM**
