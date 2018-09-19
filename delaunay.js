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
        state.boundingP1 = { x: state.minX - 10, y: state.maxY + 10 }
        state.boundingP2 = { x: state.minX - 10, y: 2 * state.minY - state.maxY - 20 }
        state.boundingP3 = { x: 2 * state.maxX - state.minX + 20, y: state.maxY + 10 }

        return { x: x, y: y }
    }

    function distance(p1, p2) {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    function cosLaw(ptA, ptB, ptC) {
        const A = distance(ptB, ptC)
        const B = distance(ptA, ptC)
        const C = distance(ptA, ptB)
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

    function partOfBounding(pts) {
        let bounding = 0
        pts.forEach((pt) => {
            if (pt == state.boundingP1 ||
                pt == state.boundingP2 ||
                pt == state.boundingP3) {
                bounding += 1
            }
        })
        return bounding
    }

    function rightOf(pt, line) {
        const [x, y] = line
        const a = pt.x - x.x
        const b = y.x - x.x
        const c = pt.y - x.y
        const d = y.y - x.y

        return 0 > (a * d) - (b * c)
    }

    function sortVertices(vertices) {
        vertices.sort((a, b) => {
            if ((a.x < b.x) ||
                (a.x == b.x && a.y < b.y)
            ) return 1;
            if (a.x == b.x && a.y == b.y) return 0;
            return -1;
        })
        const rightMost = vertices[0]
        vertices.shift()
        vertices.sort((a,b) => {
            return (a.x > b.x) ? 1 : -1
        })

        if (!rightOf(vertices[0], [vertices[1], vertices[2]])) {
            vertices = [vertices[1], vertices[2], vertices[0]]
        }
        vertices.push(rightMost)

        return vertices
    }

    function legalise() {
        let tempTriangles = []
        state.triangles.forEach((tri1) => {
            if (partOfBounding(tri1) >= 2) {
                return
            }
            let innerTempTriangles = []
            state.triangles.forEach((tri2) => {
                if (tri1 == tri2) {
                    return
                }
                if (partOfBounding(tri2) >= 2) {
                    return
                }

                // console.log("checking vertices: ", tri1, "with:", tri2)
                let allVertices = [...tri1]
                tri2.forEach((pt1) => {
                    let unique = true
                    allVertices.forEach((pt2) => {
                        if (pt1.x == pt2.x && pt1.y == pt2.y) {
                            unique = false
                            return
                        }
                    })
                    if (unique == true) {
                        allVertices.push(pt1)
                    }
                })

                if (allVertices.length != 4) {
                    innerTempTriangles.push(tri1, tri2)
                    return
                }
                if (partOfBounding(allVertices) >= 2) {
                    return
                }
                //console.log("delaunay: ", tri1, "with:", tri2)

                allVertices = sortVertices(allVertices)
                // const [min1, min2] = maximiseAngle(allVertices)
                // if (min1 < min2) {
                //     innerTempTriangles.push([allVertices[0], allVertices[2], allVertices[3]])
                //     innerTempTriangles.push([allVertices[0], allVertices[1], allVertices[3]])
                // } else {
                //     innerTempTriangles.push([allVertices[0], allVertices[1], allVertices[2]])
                //     innerTempTriangles.push([allVertices[1], allVertices[2], allVertices[3]])
                // }
                const [A, B, C, D] = allVertices
                if (circumscribed(A, B, C, D) || circumscribed(A, D, C, B)) {
                    innerTempTriangles.push([A, B, D])
                    innerTempTriangles.push([B, C, D])
                } else if (circumscribed(A, B, D, C) || circumscribed(B, C, D, A)) {
                    innerTempTriangles.push([A, B, C])
                    innerTempTriangles.push([A, C, D])
                }

                return
            })
            tempTriangles = innerTempTriangles

            return
        })
        state.triangles = tempTriangles

        return
    }

    function maximiseAngle(allVertices) {
        let min1 = Infinity
        let min2 = Infinity
        const [A, B, C, D] = allVertices

        //first two triangle arrangement, 012, 123
        let tempMin = cosLaw(A, B, C)
        if (tempMin < min1) {
            min1 = tempMin
        }
        tempMin = cosLaw(C, A, B)
        if (tempMin < min1) {
            min1 = tempMin
        }
        tempMin = cosLaw(B, C, A)
        if (tempMin < min1) {
            min1 = tempMin
        }
        tempMin = cosLaw(B, C, D)
        if (tempMin < min1) {
            min1 = tempMin
        }
        tempMin = cosLaw(B, D, C)
        if (tempMin < min1) {
            min1 = tempMin
        }
        tempMin = cosLaw(C, D, B)
        if (tempMin < min1) {
            min1 = tempMin
        }

        //second two triangle arrangement, 023,013
        tempMin = cosLaw(A, B, D)
        if (tempMin < min2) {
            min2 = tempMin
        }
        tempMin = cosLaw(D, A, B)
        if (tempMin < min2) {
            min2 = tempMin
        }
        tempMin = cosLaw(B, D, A)
        if (tempMin < min2) {
            min2 = tempMin
        }
        tempMin = cosLaw(A, C, D)
        if (tempMin < min2) {
            min2 = tempMin
        }
        tempMin = cosLaw(A, D, C)
        if (tempMin < min2) {
            min2 = tempMin
        }
        tempMin = cosLaw(C, D, A)
        if (tempMin < min2) {
            min2 = tempMin
        }

        return [min1, min2]
    }

    function circumscribed(A, B, C, D) {
        const [Ax, Ay] = [A.x, A.y]
        const [Bx, By] = [B.x, B.y]
        const [Cx, Cy] = [C.x, C.y]
        const [Dx, Dy] = [D.x, D.y]

        const AxDx = Ax - Dx
        const AyDy = Ay - Dy

        const BxDx = Bx - Dx
        const ByDy = By - Dy

        const CxDx = Cx - Dx
        const CyDy = Cy - Dy

        const ADSq = (AxDx * AxDx) + (AyDy * AyDy)
        const BDSq = (BxDx * BxDx) + (ByDy * ByDy)
        const CDSq = (CxDx * CxDx) + (CyDy * CyDy)

        // AxDx, AyDy, ADSq
        // BxDx, ByDy, BDSq
        // CxDx, CyDy, CDSq
        return (AxDx * (ByDy * CDSq - CyDy * BDSq)
            - AyDy * (BxDx * CDSq - BDSq * CxDx)
            + ADSq * (BxDx * CyDy - CxDx * ByDy)) < 0
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
        console.log("before triangulation:", state.triangles)
        legalise()
        console.log("after triangulation:", state.triangles)

        let tempTriangles = []
        state.triangles.forEach((tri) => {
            const bounding = partOfBounding(tri)
            if (!bounding) {
                tempTriangles.push(tri)
            }
        })
        state.triangles = tempTriangles
        console.log("after removing bounding:", state.triangles)

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
        sortVertices,
        legalise,
        render, //todo: remove
    }
}
