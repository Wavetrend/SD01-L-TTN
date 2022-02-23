const { mergeConfigs } = require('../src/encoder.js');

describe('mergeConfigs', () => {

    test("distinct objects", () => {
        let o1 = { a: 1 };
        let o2 = { b: 2 };
        expect(mergeConfigs(o1, o2)).toEqual({ a: 1, b: 2 });
    });

    test ("overlapping objects", () => {
        let o1 = { a: 1 };
        let o2 = { a: 2 };
        expect(mergeConfigs(o1, o2)).toEqual({ a: 2 });
    });

    test("deep objects", () => {
        let o1 = { a: { b: 1 } };
        let o2 = { a: { b: 2 } };
        expect(mergeConfigs(o1, o2)).toEqual({ a: { b: 2 }});
    })

    test("arrays with same indexes", () => {
        let o1 = [ 1 ];
        let o2 = [ 2 ];
        expect(mergeConfigs(o1, o2)).toEqual([ 2 ]);
    })

    test("arrays with different indexes", () => {
        let o1 = []; o1[0] = 1;
        let o2 = []; o2[1] = 2;
        expect(mergeConfigs(o1, o2)).toEqual([ 1, 2 ]);
    })

    test("objects with overlapping arrays", () => {
        let o1 = { a: [ 1, 2, ] };
        let o2 = { a: [ 3, 4, ] };
        expect(mergeConfigs(o1, o2)).toEqual({ a: [ 3, 4 ] });
    })

    test("objects with overlapping arrays plus extra", () => {
        let o1 = { a: [ 1, 2, ] };
        let o2 = { a: [ 3, 4, 5 ] };
        expect(mergeConfigs(o1, o2)).toEqual({ a: [ 3, 4, 5 ] });
    })

    test("object with array using default", () => {
        let o1 = { a: [ { b: 1 }, { c: 2 } ] };
        let o2 = { a: [ { b: 2 } ] };
        expect(mergeConfigs(o1, o2)).toEqual({ a: [ { b: 2 }, { c: 2 } ] });
    })

    test("object with array using extra", () => {
        let o1 = { a: [ { b: 1 } ] };
        let o2 = { a: [ { b: 2 }, { c: 2 } ] };
        expect(mergeConfigs(o1, o2)).toEqual({ a: [ { b: 2 }, { c: 2 } ] });
    })

});

