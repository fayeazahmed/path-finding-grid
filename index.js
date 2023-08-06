init();

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
    for (let y = 0; y < N; y++) {
        let str = ""
        for (let x = 0; x < N; x++) {
            vertices[y][x].calculateEdgeAndHeuristic()
            str += `---${y} ${x} ${vertices[y][x].h}---`
        }
        // console.log(str);
    }

    // console.log(vertices);

}
