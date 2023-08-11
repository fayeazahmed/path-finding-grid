const LENGTH = 500
const N = 50
const L = LENGTH / N
const W = 1
const goalY = LENGTH - L
const goalX = LENGTH - L
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
                (x === 0 && y === 0) || (x === goalX / L && y === goalY / L)
                    ? new Vertex(x, y).draw()
                    : new Vertex(x, y, Math.random() < 0.4).draw();
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
    const goal = vertices[N - 20][N - 1]
    const x1 = src.point.x
    const y1 = src.point.y
    const x2 = goalX
    const y2 = goalY
    // Check if the current cell or the goal is an obstacle
    if (src.disabled) {
        return Infinity; // If either cell is an obstacle, return infinite heuristic value
    }

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}

async function findDijkstra() {
    const distances = [];
    const current = new PriorityQueue();
    const visited = [];

    for (let i = 0; i < N; i++) {
        distances.push([]);
        for (let j = 0; j < N; j++)
            distances[i][j] = new Distance(vertices[i][j], 10000)
    }
    distances[0][0].distance = 0
    current.push(distances[0][0]);
    ctx.fillStyle = "red";
    await find(distances, current, visited);
    return distances;
}

async function drawFind(point) {
    return new Promise(resolve => {
        setTimeout(() => {
            ctx.fillRect(point.x, point.y, L, L);
            resolve(); // Resolves the promise when setTimeout is done
        }, 50);
    });
}

async function find(distances, current, visited) {
    const currentVertex = current.top();
    current.pop();
    await drawFind(currentVertex.vertex.point)
    if (currentVertex.vertex.point.y === goalY && currentVertex.vertex.point.x === goalX)
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

    if (!current.empty()) await find(distances, current, visited);
}

function drawPath(distances) {
    let i = 0
    let path = []
    let v = distances[goalY / L][goalX / L]
    while (v !== null) {
        path.push(v.vertex)
        v = v.prev
    }

    ctx.fillStyle = "green";
    path = path.reverse()

    setInterval(() => {
        const vertex = path[i++];
        if (!vertex) return

        ctx.fillRect(vertex.point.x, vertex.point.y, vertex.length, vertex.length);
    }, 50);

}

