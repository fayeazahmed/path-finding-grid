class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Vertex {
    length = 100

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

    calculateEdgeAndHeuristic() {
        if (!this.disabled)
            this.edges = getEdges(this.point)

        this.h = manhattanDistanceWithObstaclesHeuristic(this)
    }
}