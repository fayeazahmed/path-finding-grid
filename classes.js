class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Vertex {
    length = L

    constructor(x, y, disabled = false) {
        this.point = new Point(x * this.length, y * this.length)
        this.disabled = disabled
    }

    draw() {
        ctx.fillStyle = this.disabled ? "grey" : "white";
        ctx.fillRect(this.point.x, this.point.y, this.length, this.length);
        ctx.strokeRect(this.point.x, this.point.y, this.length, this.length);
        return this
    }

    calculateEdge() {
        if (!this.disabled)
            this.edges = getEdges(this.point)
    }

    calculateHeuristic() {
        this.h = manhattanDistanceHeuristic(this)
    }
}

class Distance {
    constructor(vertex, distance) {
        this.vertex = vertex
        this.distance = distance + vertex.h
        this.prev = null
    }
}

class PriorityQueue {

    constructor() {
        this.data = []
        this.size = 0
    }

    heapify() {
        for (let i = this.size - 1; i >= 0; i--) {
            const childNode = this.data[i];
            const parentIndex = Math.floor((i - 1) / 2);

            if (parentIndex < 0) continue;
            const parentNode = this.data[parentIndex];
            if ((childNode.distance + childNode.vertex.h) < (parentNode.distance + parentNode.vertex.h)) {
                this.data[parentIndex] = childNode;
                this.data[i] = parentNode;
            }
        }
    }

    push(distance) {
        this.data[this.size++] = distance
        if (this.size == 1) return;

        this.heapify();
    }

    top() {
        return this.data[0]
    }

    pop() {
        this.data[0] = this.data[this.size - 1];
        this.size--;
        this.data.pop()
        this.heapify();
    }

    empty() {
        return this.data.length === 0
    }

    clear() {
        this.data.length = 0;
        this.size = 0
    }

}