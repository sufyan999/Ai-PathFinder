import React, { useState } from 'react';
import './App.css';

// --- 1. THE GRAPH DATA (US Map) ---
const graph = {
  'Seattle': {'San Francisco': 807, 'Minneapolis': 1655, 'Denver': 1305},
  'San Francisco': {'Seattle': 807, 'Los Angeles': 381, 'Las Vegas': 568},
  'Los Angeles': {'San Francisco': 381, 'Las Vegas': 270, 'Phoenix': 372},
  'Las Vegas': {'San Francisco': 568, 'Los Angeles': 270, 'Denver': 750, 'Phoenix': 297},
  'Phoenix': {'Los Angeles': 372, 'Las Vegas': 297, 'Denver': 780, 'Dallas': 1065},
  'Denver': {'Seattle': 1305, 'Las Vegas': 750, 'Phoenix': 780, 'Minneapolis': 915, 'St. Louis': 850},
  'Minneapolis': {'Seattle': 1655, 'Denver': 915, 'Chicago': 409},
  'Chicago': {'Minneapolis': 409, 'St. Louis': 297, 'Washington DC': 700, 'Boston': 983},
  'St. Louis': {'Denver': 850, 'Chicago': 297, 'Dallas': 630, 'Atlanta': 555},
  'Dallas': {'Phoenix': 1065, 'St. Louis': 630, 'Houston': 239},
  'Houston': {'Dallas': 239, 'New Orleans': 348},
  'New Orleans': {'Houston': 348, 'Atlanta': 470, 'Miami': 860},
  'Atlanta': {'St. Louis': 555, 'New Orleans': 470, 'Miami': 663, 'Washington DC': 640},
  'Miami': {'New Orleans': 860, 'Atlanta': 663},
  'Washington DC': {'Chicago': 700, 'Atlanta': 640, 'New York': 226},
  'New York': {'Washington DC': 226, 'Boston': 215},
  'Boston': {'New York': 215, 'Chicago': 983}
};

const cities = Object.keys(graph).sort();

function App() {
  const [startCity, setStartCity] = useState(cities[0]);
  const [endCity, setEndCity] = useState('New York');
  const [result, setResult] = useState(null);

  // --- 2. THE ALGORITHMS (JavaScript Version) ---

  const solveBFS = () => {
    let queue = [[startCity, [startCity]]];
    let visited = new Set();
    let steps = 0;

    while (queue.length > 0) {
      steps++;
      let [vertex, path] = queue.shift(); // FIFO

      if (!visited.has(vertex)) {
        visited.add(vertex);
        if (vertex === endCity) {
          return { path, cost: calculateCost(path), steps };
        }
        for (let neighbor in graph[vertex]) {
          if (!visited.has(neighbor)) {
            queue.push([neighbor, [...path, neighbor]]);
          }
        }
      }
    }
    return { error: true };
  };

  const solveDFS = () => {
    let stack = [[startCity, [startCity]]];
    let visited = new Set();
    let steps = 0;

    while (stack.length > 0) {
      steps++;
      let [vertex, path] = stack.pop(); // LIFO

      if (!visited.has(vertex)) {
        visited.add(vertex);
        if (vertex === endCity) {
          return { path, cost: calculateCost(path), steps };
        }
        for (let neighbor in graph[vertex]) {
          if (!visited.has(neighbor)) {
            stack.push([neighbor, [...path, neighbor]]);
          }
        }
      }
    }
    return { error: true };
  };

  const solveUCS = () => {
    // Priority Queue: { cost, node, path }
    let pq = [{ cost: 0, node: startCity, path: [startCity] }];
    let visited = new Set();
    let steps = 0;

    while (pq.length > 0) {
      steps++;
      // Sort to simulate Priority Queue (Smallest cost first)
      pq.sort((a, b) => a.cost - b.cost);
      let { cost, node, path } = pq.shift();

      if (!visited.has(node)) {
        visited.add(node);
        if (node === endCity) {
          return { path, cost, steps };
        }
        for (let neighbor in graph[node]) {
          let newCost = cost + graph[node][neighbor];
          if (!visited.has(neighbor)) {
            pq.push({ cost: newCost, node: neighbor, path: [...path, neighbor] });
          }
        }
      }
    }
    return { error: true };
  };

  const calculateCost = (path) => {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      total += graph[path[i]][path[i + 1]];
    }
    return total;
  };

  const handleSearch = (algo) => {
    let res;
    if (algo === 'BFS') res = solveBFS();
    if (algo === 'DFS') res = solveDFS();
    if (algo === 'UCS') res = solveUCS();
    
    setResult({ ...res, algoName: algo });
  };

  return (
    <div className="app-container">
      
      <div className="card">
        <div className="header">
          <h1>US Map Search (React)</h1>
          <p>Select start and end cities to visualize algorithms.</p>
        </div>

        <div className="controls">
          <div className="input-group">
            <label>Start City</label>
            <select value={startCity} onChange={(e) => setStartCity(e.target.value)}>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <div className="arrow">➜</div>
          <div className="input-group">
            <label>Destination</label>
            <select value={endCity} onChange={(e) => setEndCity(e.target.value)}>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
        </div>

        <div className="buttons">
          <button className="btn btn-bfs" onClick={() => handleSearch('BFS')}>Breadth-First (BFS)</button>
          <button className="btn btn-dfs" onClick={() => handleSearch('DFS')}>Depth-First (DFS)</button>
          <button className="btn btn-ucs" onClick={() => handleSearch('UCS')}>Uniform Cost (UCS)</button>
        </div>

        {result && (
          <div className="result-box">
            <h3>Search Results</h3>
            <div className="result-item">
              <span>Algorithm:</span> <strong>{result.algoName}</strong>
            </div>
            <div className="result-item">
              <span>Total Cost:</span> <strong>{result.cost} miles</strong>
            </div>
            <div className="result-item">
              <span>Nodes Visited:</span> <strong>{result.steps}</strong>
            </div>
            <div className="path-display">
              <small>Path Found:</small>
              <p>{result.path ? result.path.join(' → ') : 'No path found'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;