export function NewDelaunay() {

    const state = {
        points: [],
        triangles: [],
    }

    function addPoint(x, y) {
        state.points.push({ x: x, y: y })
        return { x: x, y: y }
    }

    function connectPoints() {
        state.drawPaths = true
        state.paths = []
        if (state.points.length < 3) {
            return
        }
        if (state.points.length == 3) {
            state.paths.push("" + state.points[0].x + "," + state.points[0].y + " "
                + state.points[1].x + "," + state.points[1].y + " "
                + state.points[2].x + "," + state.points[2].y + ""
            )
            return
        }

        for (let i = 0; i < state.points.length; i++) {
            const A = state.points[i]
            const [B, C, D] = closest3(A)
            localDelaunay(A, B, C, D)
        }
        state.paths = [... new Set(state.paths)]
    }

    function distance(p1, p2) {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    function cosLaw(A, B, C) {
        return Math.acos((A * A + B * B - C * C) / (2 * A * B))
    }

    function triangulate() {
        const sorted = state.points.sort((pt1, pt2) => {
            if (pt1.x < pt2.x) return -1
            if (pt1.x > pt2.x) return 1
            return 0
        })
        if (sorted.length == 3) {
            state.triangles.push([sorted[0], sorted[1], sorted[2]])
        }
        sorted.forEach((pt, i) => {
            if (i < 2) return
            state.triangles.forEach((tr) => {
                localDelaunay(tr,pt)
            })
            return
        })
        return
    }

    function localDelaunay(tr, pt) {
        
    }

    return {
        state,
        addPoint,
        connectPoints,
        triangulate,
    }
}
