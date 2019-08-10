import { createLinearRampToValueAutomationEvent } from '../../../src/functions/create-linear-ramp-to-value-automation-event';

describe('createLinearRampToValueAutomationEvent()', () => {

    it('should return an object which implements the ILinearRampToValueAutomationEvent interface', () => {
        const linearRampToValueAutomationEvent = createLinearRampToValueAutomationEvent(2, 1);

        expect(linearRampToValueAutomationEvent.endTime).to.be.a('number');
        expect(linearRampToValueAutomationEvent.type).to.equal('linearRampToValue');
        expect(linearRampToValueAutomationEvent.value).to.be.a('number');
    });

    it('should return an object with the given endTime', () => {
        const linearRampToValueAutomationEvent = createLinearRampToValueAutomationEvent(2, 1);

        expect(linearRampToValueAutomationEvent.endTime).to.equal(1);
    });

    it('should return an object with the given value', () => {
        const linearRampToValueAutomationEvent = createLinearRampToValueAutomationEvent(2, 1);

        expect(linearRampToValueAutomationEvent.value).to.equal(2);
    });

});
