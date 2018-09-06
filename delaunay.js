export function NewDelaunay() {

    const state = {
        points: [],
        triangles: [],
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
        boundingP1: {},
        boundingP2: {},
        boundingP3: {},
        paths: [], //Todo: move outside with render()
    }

    function addPoint(x, y) {
        state.points.push({ x: x, y: y })
        if (x < state.minX) {
            state.minX = x
        }
        if (x > state.maxX) {
            state.maxX = x
        }
        if (y < state.minY) {
            state.minY = y
        }
        if (y > state.maxY) {
            state.maxY = y
        }
        state.boundingP1 = { x: state.minX - 10 , y: state.maxY + 10 }
        state.boundingP2 = { x: state.minX - 10, y: 2 * state.minY - state.maxY - 20 }
        state.boundingP3 = { x: 2 * state.maxX - state.minX + 20, y: state.maxY + 10 }

        return { x: x, y: y }
    }

    function distance(p1, p2) {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    function cosLaw(A, B, C) {
        return Math.acos((A * A + B * B - C * C) / (2 * A * B))
    }

    function pointInTriangle(tri, pt) {
        /* To determine if a point lies in a triangle:
         * Cross the vector from a vertex to the point with
         * the vector of the edge leaving that vertex.
         * If all cross products have the same sign then the
         * point lies in triangle's interior
         */
        const ptx = pt.x
        const pty = pt.y
        const v_0x = tri[0].x
        const v_0y = tri[0].y
        const v_1x = tri[1].x
        const v_1y = tri[1].y
        const v_2x = tri[2].x
        const v_2y = tri[2].y

        const k1 = (ptx - v_0x) * (v_1y - v_0y) - (pty - v_0y) * (v_1x - v_0x)
        const k2 = (ptx - v_1x) * (v_2y - v_1y) - (pty - v_1y) * (v_2x - v_1x)
        const k3 = (ptx - v_2x) * (v_0y - v_2y) - (pty - v_2y) * (v_0x - v_2x)

        if ((k1 < 0 && k2 < 0 && k3 < 0) || (k1 > 0 && k2 > 0 && k3 > 0)) {
            return true
        }
        return false
    }

    function legalise() {
        state.triangles.forEach((tri1) => {
            state.triangles.forEach((tri2) => {
                if (tri1 == tri2) {
                    return
                }
                const allVertices = new Set([...tri1, ...tri2])
                //todo: ensure set is correct, coslaw, retriangulate
                return
            })
            return
        })
    }

    function triangulate() {
        state.triangles.push([state.boundingP1, state.boundingP2, state.boundingP3])
        state.points.forEach((pt) => {
            let tempTriangles = []
            state.triangles.forEach((tri) => {
                if (pointInTriangle(tri, pt)) {
                    tempTriangles.push(
                        [pt, tri[0], tri[1]],
                        [pt, tri[1], tri[2]],
                        [pt, tri[0], tri[2]],
                    )
                } else {
                    tempTriangles.push(tri)
                }
            })
            state.triangles = tempTriangles
        })
        // Todo: legalise triangles

        // Todo: remove bounding triangle
    }

    // Todo: move outside
    function render() {
        triangulate()
        state.triangles.forEach((tri) => {
            const path = "" + tri[0].x + "," + tri[0].y + " "
                + tri[1].x + "," + tri[1].y + " "
                + tri[2].x + "," + tri[2].y + ""
            state.paths.push(path)
        })
    }

    return {
        state,
        addPoint,
        pointInTriangle,
        render,
        legalise,
        triangulate,
        legalise,
        render, //todo: remove
    }
}
