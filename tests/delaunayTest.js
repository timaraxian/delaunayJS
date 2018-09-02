import { expect } from 'chai'
import { NewDelaunay } from "../delaunay"

describe('Delaunay', () => {

    it('initialises a new Delaunay Triangulation', () => {
        const d = NewDelaunay()

        expect(d.state.points.length).equals(0)
        expect(d.state.points).eql([])
        expect(d.state.paths.length).equals(0)
        expect(d.state.points).eql([])
    })
})
