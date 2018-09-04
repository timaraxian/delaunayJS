import { NewDelaunay } from "./delaunay";

const delauney = NewDelaunay()

var app = new Vue({
    el: '#app',

    data: {
        model: delauney.state
    },

    methods: {
        addPoint: ({ clientX, clientY }) => delauney.addPoint(clientX, clientY),
        paths: () => delauney.render(),
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
