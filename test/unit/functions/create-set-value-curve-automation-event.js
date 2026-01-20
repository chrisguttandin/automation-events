import { beforeEach, describe, expect, it } from 'vitest';
import { createSetValueCurveAutomationEvent } from '../../../src/functions/create-set-value-curve-automation-event';

describe('createSetValueCurveAutomationEvent()', () => {
    for (const arrayType of ['regular Array', 'Float32Array']) {
        describe(`with a ${arrayType}`, () => {
            let values;

            beforeEach(() => {
                values = [1, 2, 3];

                if (arrayType === 'Float32Array') {
                    values = new Float32Array(values);
                }
            });

            it('should return an object which implements the ISetValueCurveAutomationEvent interface', () => {
                const setValueCurveAtTimeAutomationEvent = createSetValueCurveAutomationEvent(values, 1, 4);

                expect(setValueCurveAtTimeAutomationEvent.duration).to.be.a('number');
                expect(setValueCurveAtTimeAutomationEvent.startTime).to.be.a('number');
                expect(setValueCurveAtTimeAutomationEvent.type).to.equal('setValueCurve');
                expect(setValueCurveAtTimeAutomationEvent.values).to.be.a(arrayType === 'Float32Array' ? 'Float32Array' : 'Array');
            });

            it('should return an object with the given duration', () => {
                const setValueCurveAtTimeAutomationEvent = createSetValueCurveAutomationEvent(values, 1, 4);

                expect(setValueCurveAtTimeAutomationEvent.duration).to.equal(4);
            });

            it('should return an object with the given startTime', () => {
                const setValueCurveAtTimeAutomationEvent = createSetValueCurveAutomationEvent(values, 1, 4);

                expect(setValueCurveAtTimeAutomationEvent.startTime).to.equal(1);
            });

            it('should return an object with the given values', () => {
                const setValueCurveAtTimeAutomationEvent = createSetValueCurveAutomationEvent(values, 1, 4);

                expect(setValueCurveAtTimeAutomationEvent.values).to.equal(values);
            });
        });
    }
});
