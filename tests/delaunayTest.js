import { expect } from 'chai'
import { NewDelaunay } from "../delaunay"

describe('Delaunay', () => {

    it('initialises a new Delaunay Triangulation', () => {
        const d = NewDelaunay()

        expect(d.state.points.length).equals(0)
        expect(d.state.points).eql([])
        expect(d.state.triangles.length).equals(0)
        expect(d.state.triangles).eql([])
    })

    it('adds a point', () => {
        const d = NewDelaunay()

        const pt1 = d.addPoint(10, 25)
        expect(d.state.points.length).equals(1)
        expect(d.state.points).eql([pt1])
        expect(d.state.triangles.length).equals(0)
        expect(d.state.triangles).eql([])
    })

    it('adds multiple points', () => {
        const d = NewDelaunay()

        const pt1 = d.addPoint(10, 5)
        const pt2 = d.addPoint(5, 10)
        const pt3 = d.addPoint(20, 10)
        const pt4 = d.addPoint(10, 25)

        expect(d.state.points.length).equals(4)
        expect(d.state.points).eql([pt1, pt2, pt3, pt4])
    })

    it('finds the bounding triangle', () => {
        const d = NewDelaunay()

        const pt1 = d.addPoint(10, 10)

        const expect1 = { x: pt1.x - 10, y: pt1.y + 10 }
        const expect2 = { x: pt1.x - 10, y: 2 * pt1.y - pt1.y - 20 }
        const expect3 = { x: 2 * pt1.x - pt1.x + 20, y: pt1.y + 10 }

        expect(d.state.boundingP1).eql(expect1)
        expect(d.state.boundingP2).eql(expect2)
        expect(d.state.boundingP3).eql(expect3)
    })

    it('finds the bounding triangle multiple points', () => {
        const d = NewDelaunay()

        d.addPoint(3, 2)
        d.addPoint(3, 7)
        d.addPoint(7, 5)

        const expect1 = { x: -7, y: 17 }
        const expect2 = { x: -7, y: -23 }
        const expect3 = { x: 31, y: 17 }

        expect(d.state.boundingP1).eql(expect1)
        expect(d.state.boundingP2).eql(expect2)
        expect(d.state.boundingP3).eql(expect3)
    })

    it('determines if a point is in a triangle', () => {
        const d = NewDelaunay()

        const pt1 = { x: 1, y: 1 }
        const pt2 = { x: 10, y: 12}
        const tri = [
            { x: -3, y: 0 },
            { x: 0, y: 3 },
            { x: 3, y: 0 },
        ]

        const expect1 = d.pointInTriangle(tri, pt1)
        const expect2 = d.pointInTriangle(tri, pt2)

        expect(expect1).equals(true)
        expect(expect2).equals(false)
    })

    it('triangulates (incorrectly) with bounding triangle', () => {
        //This test will be removed once the correct triangulation is implemented
        const d = NewDelaunay()

        const pt = d.addPoint(10, 10)

        d.triangulate()

        expect(d.state.triangles.length).equals(3)
        expect(d.state.triangles).eql([
            [pt, d.state.boundingP1,d.state.boundingP2],
            [pt, d.state.boundingP2,d.state.boundingP3],
            [pt, d.state.boundingP1,d.state.boundingP3],
        ])
    })
})
