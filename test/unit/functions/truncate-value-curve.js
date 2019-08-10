import { truncateValueCurve } from '../../../src/functions/truncate-value-curve';

describe('truncateValueCurve()', () => {

    it('should truncate a curve which exactly fits into the new duration', () => {
        expect(truncateValueCurve(new Float32Array([ 6, 7, 8 ]), 6, 3)).to.deep.equal(new Float32Array([ 6, 7 ]));
    });

    it('should truncate a curve which has to be interpolated to fit into the new duration', () => {
        expect(truncateValueCurve(new Float32Array([ 6, 7, 8, 9 ]), 6, 3)).to.deep.equal(new Float32Array([ 6, 6.75, 7.5 ]));
    });

});
