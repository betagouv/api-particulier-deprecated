const expect = require('chai').expect
const pickExtended = require('../../lib/utils/pickExtended')

describe('utils: pickExtended', () => {
  const object = {
    a: 1,
    b: '2',
    c: { d: 3, e: 4 },
    f: [
      { a: 11, b: 12, c: [{ d: 21, e: 22 }, { d: 31, e: 32 }] },
      { a: 13, b: 14, c: [{ d: 23, e: 24 }, { d: 33, e: 34 }] }
    ],
    g: [],
    h: [{a: 41}, {a: 42}, {a: 43}]
  }

  it('should pick properties in nested collection', () => {
    expect(
      pickExtended(object, ['a', 'c.d', 'f[].c[].d', 'g[].a', 'b[].a', 'h[]'])
    ).to.deep.equal({
      a: 1,
      c: { d: 3 },
      f: [{ c: [{ d: 21 }, { d: 31 }] }, { c: [{ d: 23 }, { d: 33 }] }],
      g: []
    })
  })
})
