import { createSetValueAutomationEvent } from '../../../src/functions/create-set-value-automation-event';

describe('createSetValueAutomationEvent()', () => {
    it('should return an object which implements the ISetValueAutomationEvent interface', () => {
        const setValueAtTimeAutomationEvent = createSetValueAutomationEvent(2, 1);

        expect(setValueAtTimeAutomationEvent.startTime).to.be.a('number');
        expect(setValueAtTimeAutomationEvent.type).to.equal('setValue');
        expect(setValueAtTimeAutomationEvent.value).to.be.a('number');
    });

    it('should return an object with the given startTime', () => {
        const setValueAtTimeAutomationEvent = createSetValueAutomationEvent(2, 1);

        expect(setValueAtTimeAutomationEvent.startTime).to.equal(1);
    });

    it('should return an object with the given value', () => {
        const setValueAtTimeAutomationEvent = createSetValueAutomationEvent(2, 1);

        expect(setValueAtTimeAutomationEvent.value).to.equal(2);
    });
});
