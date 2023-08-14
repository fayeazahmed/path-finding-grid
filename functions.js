function init() {
    for (let y = 0; y < N; y++) {
        vertices.push([]);
        for (let x = 0; x < N; x++) {
            vertices[y][x] = new Vertex(x, y, Math.random() < 0.3).draw()
        }
    }
    for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++)
            vertices[y][x].calculateEdge()

}

function select(e) {
    const rect = canvas.getBoundingClientRect(); // Get the canvas bounding rectangle
    const x = Math.floor((e.clientX - rect.left) / L); // Adjust for the canvas position
    const y = Math.floor((e.clientY - rect.top) / L);
    const v = vertices[y][x]
    if (!v.disabled) {
        if (SRC === v || GOAL === v) {
            removeSelection(v)
            return
        }

        if (!SRC) {
            SRC = v
            ctx.fillStyle = "red"
            ctx.fillRect(SRC.point.x, SRC.point.y, SRC.length, SRC.length);
        } else if (!GOAL) {
            GOAL = v
            ctx.fillStyle = "green"
            ctx.fillRect(GOAL.point.x, GOAL.point.y, GOAL.length, GOAL.length);
        }

        if (SRC && GOAL) {
            for (let y = 0; y < N; y++)
                for (let x = 0; x < N; x++)
                    vertices[y][x].calculateHeuristic()

            BTN.disabled = false
        }

        updateMessage()
    }
}

function removeSelection(v) {
    if (SRC === v) SRC = null
    else GOAL = null

    ctx.fillStyle = "white";
    ctx.fillRect(v.point.x, v.point.y, v.length, v.length);
    ctx.strokeRect(v.point.x, v.point.y, v.length, v.length);
    updateMessage()
}

function updateMessage() {
    if (!SRC && !GOAL)
        HINTS.textContent = SRC_DST_MESSAGE
    else if (!SRC)
        HINTS.textContent = SRC_MESSAGE
    else if (!GOAL)
        HINTS.textContent = DST_MESSAGE
    else
        HINTS.textContent = PLAY_MESSAGE

}

function start(e) {
    if (!BTN.disabled) {
        if (!RUNNING) {
            RUNNING = true
            BTN.innerHTML = STOP_ICON
            HINTS.textContent = ""
            findDijkstra().then(distances => drawPath(distances))
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            init()
            SRC = GOAL = null
            RUNNING = false
            BTN.innerHTML = PLAY_ICON
            BTN.disabled = true
            HINTS.textContent = SRC_DST_MESSAGE
        }
    }
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

function manhattanDistanceHeuristic(SRC) {
    if (SRC.point.x === GOAL.point.x && SRC.point.y === GOAL.point.y) return 0;

    const x1 = SRC.point.x
    const y1 = SRC.point.y
    const x2 = GOAL.point.x
    const y2 = GOAL.point.y

    if (SRC.disabled) {
        return Infinity;
    }

    if (x1 - L == x2 && y1 - L == y2) {
        return 1;
    } // TL
    if (y1 - L == y2) {
        return 1;
    } // T
    if (x1 + L == x2 && y1 - L == y2) {
        return 1;
    } // TR
    if (x1 + L == x2) {
        return 1;
    } // R
    if (x1 + L == x2 && y1 + L == y2) {
        return 1;
    } // BR
    if (y1 + L == y2) {
        return 1;
    } // B
    if (x1 - L == x2 && y1 + L == y2) {
        return 1;
    } // BL
    if (x1 - L == x2) {
        return 1;
    } // L


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
    distances[SRC.point.y / L][SRC.point.x / L].distance = 0
    current.push(distances[SRC.point.y / L][SRC.point.x / L]);
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
    if (currentVertex.vertex.point.y === GOAL.point.y && currentVertex.vertex.point.x === GOAL.point.x)
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
    let v = distances[GOAL.point.y / L][GOAL.point.x / L]
    while (v !== null) {
        path.push(v.vertex)
        v = v.prev
    }

    ctx.fillStyle = "green";
    path = path.reverse()

    const intervalId = setInterval(() => {
        const vertex = path[i++];
        if (!vertex) {
            HINTS.textContent = DONE_MESSAGE
            clearInterval(intervalId)
            return
        }

        ctx.fillRect(vertex.point.x, vertex.point.y, vertex.length, vertex.length);
    }, 50);
}