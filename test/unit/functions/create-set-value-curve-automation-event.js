import { createSetValueCurveAutomationEvent } from '../../../src/functions/create-set-value-curve-automation-event';

describe('createSetValueCurveAutomationEvent()', () => {
    let values;

    beforeEach(() => {
        values = new Float32Array([1, 2, 3]);
    });

    it('should return an object which implements the ISetValueCurveAutomationEvent interface', () => {
        const setValueCurveAtTimeAutomationEvent = createSetValueCurveAutomationEvent(values, 1, 4);

        expect(setValueCurveAtTimeAutomationEvent.duration).to.be.a('number');
        expect(setValueCurveAtTimeAutomationEvent.startTime).to.be.a('number');
        expect(setValueCurveAtTimeAutomationEvent.type).to.equal('setValueCurve');
        expect(setValueCurveAtTimeAutomationEvent.values).to.be.a('Float32Array');
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
