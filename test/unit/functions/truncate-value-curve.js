import { beforeEach, describe, expect, it } from 'vitest';
import { truncateValueCurve } from '../../../src/functions/truncate-value-curve';

describe('truncateValueCurve()', () => {
    for (const arrayType of ['regular Array', 'Float32Array']) {
        describe(`with a ${arrayType}`, () => {
            describe('with a curve which exactly fits into the new duration', () => {
                let truncatedValues;
                let values;

                beforeEach(() => {
                    truncatedValues = [6, 7];
                    values = [6, 7, 8];

                    if (arrayType === 'Float32Array') {
                        truncatedValues = new Float32Array(truncatedValues);
                        values = new Float32Array(values);
                    }
                });

                it('should truncate the curve', () => {
                    expect(truncateValueCurve(values, 6, 3)).to.deep.equal(truncatedValues);
                });
            });

            describe('with a curve which has to be interpolated to fit into the new duration', () => {
                let truncatedValues;
                let values;

                beforeEach(() => {
                    truncatedValues = [6, 6.75, 7.5];
                    values = [6, 7, 8, 9];

                    if (arrayType === 'Float32Array') {
                        truncatedValues = new Float32Array(truncatedValues);
                        values = new Float32Array(values);
                    }
                });

                it('should truncate the curve', () => {
                    expect(truncateValueCurve(values, 6, 3)).to.deep.equal(truncatedValues);
                });
            });
        });
    }
});
