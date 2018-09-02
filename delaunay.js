function NewDelaunay() {

    const state = {
        points: [],
        paths: [],
        drawPaths: false,
    }

    function addPoint(x, y) {
        state.points.push({ x: x, y: y})
    }

    function connectPoints() {
        state.drawPaths = true
        state.paths = []
        if (state.points.length < 3) {
            return
        }
        if (state.points.length == 3) {
            state.paths.push(""+state.points[0].x+","+state.points[0].y+" "
                +state.points[1].x+","+state.points[1].y+" "
                +state.points[2].x+","+state.points[2].y+""
            )
            return
        }

        for (let i = 0; i < state.points.length; i++) {
            const A = state.points[i]
            const [B, C, D] = closest3(A)
            localDelaunay(A,B,C,D)
        }
        state.paths = [... new Set(state.paths)]
    }

    function closest3(point) {
        let [min1, min2, min3] = [Infinity, Infinity, Infinity]
        let [point1, point2, point3] = [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]
        for (let j = 0; j < state.points.length; j++) {
            if (state.points[j].x == point.x && state.points[j].y == point.y) {
                continue
            }
            let dist = Math.sqrt((point.x-state.points[j].x)*(point.x-state.points[j].x) +
                (point.y-state.points[j].y)*(point.y-state.points[j].y))
            if (dist < min3) {
                if (dist < min2) {
                    if (dist < min1) {
                        min3 = min2
                        min2 = min1
                        min1 = dist
                        point3 = point2
                        point2 = point1
                        point1 = state.points[j]
                        continue
                    }
                    min3 = min2
                    min2 = dist
                    point3 = point2
                    point2 = state.points[j]
                    continue
                }
                min3 = dist
                point3 = state.points[j]
            }
        }
        return [point1, point2, point3]
    }

    function localDelaunay(A,B,C,D) {
        const dAB = Math.sqrt((A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y))
        const dAC = Math.sqrt((A.x-C.x)*(A.x-C.x)+(A.y-C.y)*(A.y-C.y))
        const dBC = Math.sqrt((B.x-C.x)*(B.x-C.x)+(B.y-C.y)*(B.y-C.y))
        const dAD = Math.sqrt((A.x-D.x)*(A.x-D.x)+(A.y-D.y)*(A.y-D.y))
        const dDC = Math.sqrt((D.x-C.x)*(D.x-C.x)+(D.y-C.y)*(D.y-C.y))
        const dBD = Math.sqrt((B.x-D.x)*(B.x-D.x)+(B.y-D.y)*(B.y-D.y))

        let min1 = Infinity
        // /_\ ABC & ADC

        // /_ABC
        let angle = Math.acos((dAB*dAB+dBC*dBC-dAC*dAC)/(2*dAB*dBC))
        if (angle < min1) {
            min1 = angle
        }
        // /_BAC
        angle = Math.acos((dAB*dAB+dAC*dAC-dBC*dBC)/(2*dAB*dAC))
        if (angle < min1) {
            min1 = angle
        }
        // /_BCA
        angle = Math.acos((dAC*dAC+dBC*dBC-dAB*dAB)/(2*dAC*dBC))
        if (angle < min1) {
            min1 = angle
        }
        // /_DAC
        angle = Math.acos((dAD*dAD+dAC*dAC-dDC*dDC)/(2*dAD*dAC))
        if (angle < min1) {
            min1 = angle
        }
        // /_ADC
        angle = Math.acos((dAD*dAD+dDC*dDC-dAC*dAC)/(2*dAD*dDC))
        if (angle < min1) {
            min1 = angle
        }
        // /_ACD
        angle = Math.acos((dAC*dAC+dDC*dDC-dAD*dAD)/(2*dAC*dDC))
        if (angle < min1) {
            min1 = angle
        }

        let min2 = Infinity
        // /_\ BAD & BCD
        // /_ BAD
        angle = Math.acos((dAB*dAB+dAD*dAD-dBD*dBD)/(2*dAB*dAD))
        if (angle < min2) {
            min2 = angle
        }
        // /_ABD
        angle = Math.acos((dAB*dAB+dBD*dBD-dAD*dAD)/(2*dAB*dBD))
        if (angle < min2) {
            min2 = angle
        }
        // /_BDA
        angle = Math.acos((dAD*dAD+dBD*dBD-dAB*dAB)/(2*dAD*dBD))
        if (angle < min2) {
            min2 = angle
        }
        // /_DBC
        angle = Math.acos((dBD*dBD+dBC*dBC-dDC*dDC)/(2*dBD*dBC))
        if (angle < min2) {
            min2 = angle
        }
        // /_BDC
        angle = Math.acos((dBD*dBD+dDC*dDC-dBC*dBC)/(2*dBD*dDC))
        if (angle < min2) {
            min2 = angle
        }
        // /_BCD
        angle = Math.acos((dBC*dBC+dDC*dDC-dBD*dBD)/(2*dBC*dDC))
        if (angle < min2) {
            min2 = angle
        }
        if (min1 < min2) {
            state.paths.push(""+B.x+","+B.y+" "
                +A.x+","+A.y+" "
                +D.x+","+D.y+""
            )
            state.paths.push(""+B.x+","+B.y+" "
                +C.x+","+C.y+" "
                +D.x+","+D.y+""
            )
        } else {
            state.paths.push(""+A.x+","+A.y+" "
                +B.x+","+B.y+" "
                +C.x+","+C.y+""
            )
            state.paths.push(""+A.x+","+A.y+" "
                +D.x+","+D.y+" "
                +C.x+","+C.y+""
            )
        }
        return
    }

    return {
        state,
        addPoint,
        connectPoints,
    }
}

const delauney = NewDelaunay()

var app = new Vue({
    el: '#app',

    data: {
        model: delauney.state
    },

    methods: {
        addPoint: ({ clientX, clientY }) => delauney.addPoint(clientX, clientY),
        paths: () => delauney.connectPoints(),
    },

    template: `
<div>
<svg @click="addPoint" width="700" height="500">
<circle v-for="point in model.points" :cx="point.x" :cy="point.y" r="5"/>
<polygon 
v-for="path in model.paths" 
:points="path"
style="fill-opacity:0;stroke:rebeccapurple;stroke-width:1px"
/>
</svg>
<br>
<button @click="paths">paths</button>
</div>
`
});
