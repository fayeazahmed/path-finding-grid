const LENGTH = 500
const N = 20
const L = LENGTH / N
const W = 1
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const vertices = []

canvas.height = LENGTH
canvas.width = LENGTH
ctx.fillStyle = "#d3d3d3";
ctx.fillRect(0, 0, LENGTH, LENGTH);

function init() {
    for (let y = 0; y < N; y++) {
        vertices.push([]);
        for (let x = 0; x < N; x++) {
            vertices[y][x] =
                (x === 0 && y === 0) || (x === N - 1 && y === N - 1)
                    ? new Vertex(x, y).draw()
                    : new Vertex(x, y, Math.random() < 0.2).draw();
        }
    }
    for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++)
            vertices[y][x].calculateEdgeAndHeuristic()

}

function getEdges(point) {
    const edges = []
    const x = point.x
    const y = point.y
    if (x - L >= 0 && y - L >= 0 && !vertices[(y - L) / L][(x - L) / L].disabled) {
        edges.push(new Point(x - L, y - L))
    } // TL
    if (y - L >= 0 && !vertices[(y - L) / L][x / L].disabled) {
        edges.push(new Point(x, y - L))
    } // T
    if (x + L <= LENGTH - L && y - L >= 0 && !vertices[(y - L) / L][(x + L) / L].disabled) {
        edges.push(new Point(x + L, y - L))
    } // TR
    if (x + L <= LENGTH - L && !vertices[y / L][(x + L) / L].disabled) {
        edges.push(new Point(x + L, y))
    } // R
    if (x + L <= LENGTH - L && y + L <= LENGTH - L && !vertices[(y + L) / L][(x + L) / L].disabled) {
        edges.push(new Point(x + L, y + L))
    } // BR
    if (y + L <= LENGTH - L && !vertices[(y + L) / L][x / L].disabled) {
        edges.push(new Point(x, y + L))
    } // B
    if (x - L >= 0 && y + L <= LENGTH - L && !vertices[(y + L) / L][(x - L) / L].disabled) {
        edges.push(new Point(x - L, y + L))
    } // BL
    if (x - L >= 0 && !vertices[y / L][(x - L) / L].disabled) {
        edges.push(new Point(x - L, y))
    } // L

    return edges;
}

// From ChatGPT
// Function to calculate the Manhattan distance heuristic with obstacles
function manhattanDistanceWithObstaclesHeuristic(src) {
    const goal = vertices[N - 1][N - 1]
    const x1 = src.point.x
    const y1 = src.point.y
    const x2 = goal.point.x
    const y2 = goal.point.y
    // Check if the current cell or the goal is an obstacle
    if (src.disabled || goal.disabled) {
        return Infinity; // If either cell is an obstacle, return infinite heuristic value
    }

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);


    const h = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))

    // // Calculate the number of diagonal moves and straight moves to reach the goal
    // let diagonalMoves = Math.min(dx, dy);
    // let straightMoves = Math.abs(dx - dy);

    // // If there are obstacles in the straight path, adjust the number of straight moves
    // for (let i = 0; i < straightMoves; i++) {
    //     const x = x1 + (dx > dy ? i : 0);
    //     const y = y1 + (dy > dx ? i : 0);

    //     if (x < 0 || x >= vertices.length || y < 0 || y >= vertices[0].length) {
    //         // Check if the index is out of bounds, break the loop
    //         break;
    //     }

    //     if (vertices[x][y].disabled) {
    //         // If the vertex is disabled, adjust the number of straight moves
    //         straightMoves = i;
    //         break;
    //     }
    // }

    // // If there are obstacles in the diagonal path, adjust the number of diagonal moves
    // for (let i = 0; i < diagonalMoves; i++) {
    //     const x = x1 + (dx > dy ? i : 0)
    //     const y = y1 + (dy > dx ? i : 0);

    //     if (x < 0 || x >= vertices.length || y < 0 || y >= vertices[0].length) {
    //         // Check if the index is out of bounds, break the loop
    //         break;
    //     }

    //     if (vertices[x][y].disabled) {
    //         diagonalMoves = i;
    //         break;
    //     }
    // }
    return h;
    // return diagonalMoves * 10 + straightMoves * 14;
}

function findDijkstra() {
    const distances = [];
    const current = new PriorityQueue();
    const visited = [];

    for (let i = 0; i < N; i++) {
        distances.push([]);
        for (let j = 0; j < N; j++)
            distances[i][j] = new Distance(vertices[i][j], Number.MAX_VALUE)
    }
    distances[0][0].distance = 0
    current.push(distances[0][0]);

    find(distances, current, visited);
    console.log(distances);
    return distances;
}

function find(distances, current, visited) {
    const currentVertex = current.top();
    current.pop();
    console.log(currentVertex.vertex.point.y, currentVertex.vertex.point.x);
    if (currentVertex.vertex.point.y === LENGTH - L && currentVertex.vertex.point.x === LENGTH - L)
        return;


    for (const edge of currentVertex.vertex.edges) {
        const v = vertices[edge.y / L][edge.x / L]
        if (!visited.find(vertex => v === vertex)) {
            if (distances[v.point.y / L][v.point.x / L].distance > (W + currentVertex.distance)) {
                distances[v.point.y / L][v.point.x / L].distance = W + currentVertex.distance;
                distances[v.point.y / L][v.point.x / L].prev = currentVertex;
                current.push(distances[v.point.y / L][v.point.x / L]);
            }
        }
    }

    visited.push(currentVertex.vertex);

    if (!current.empty()) find(distances, current, visited);
}

function drawPath(distances) {
    let v = distances[(LENGTH - L) / L][(LENGTH - L) / L]
    while (v !== null) {
        const vertex = v.vertex
        ctx.fillStyle = "green";
        ctx.fillRect(vertex.point.x, vertex.point.y, vertex.length, vertex.length);
        v = v.prev
    }
}