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

    it('triangulates 3 points', () => {
        const d = NewDelaunay()

        const pt1 = d.addPoint(10, 5)
        const pt2 = d.addPoint(5, 10)
        const pt3 = d.addPoint(20, 10)

        expect(d.state.points.length).equals(3)
        expect(d.state.points).eql([pt1, pt2, pt3])

        d.triangulate()
        expect(d.state.triangles.length).equals(1)
        expect(d.state.triangles).eql([[pt2, pt1, pt3]])
    })

    it('correctly triangulates 4 points', () => {
        const d = NewDelaunay()

        const pt1 = d.addPoint(10, 5)
        const pt2 = d.addPoint(5, 10)
        const pt3 = d.addPoint(20, 10)
        const pt4 = d.addPoint(10, 25)

        d.triangulate()
        expect(d.state.triangles.length).equals(2)
        expect(d.state.triangles).eql([[pt2, pt1, pt3], [pt2, pt4, pt3]])
    })
})
