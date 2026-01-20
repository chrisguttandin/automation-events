import { describe, expect, it } from 'vitest';
import { createExponentialRampToValueAutomationEvent } from '../../../src/functions/create-exponential-ramp-to-value-automation-event';

describe('createExponentialRampToValueAutomationEvent()', () => {
    it('should return an object which implements the IExponentialRampToValueAutomationEvent interface', () => {
        const exponentialRampToValueAutomationEvent = createExponentialRampToValueAutomationEvent(2, 1);

        expect(exponentialRampToValueAutomationEvent.endTime).to.be.a('number');
        expect(exponentialRampToValueAutomationEvent.type).to.equal('exponentialRampToValue');
        expect(exponentialRampToValueAutomationEvent.value).to.be.a('number');
    });

    it('should return an object with the given endTime', () => {
        const exponentialRampToValueAutomationEvent = createExponentialRampToValueAutomationEvent(2, 1);

        expect(exponentialRampToValueAutomationEvent.endTime).to.equal(1);
    });

    it('should return an object with the given value', () => {
        const exponentialRampToValueAutomationEvent = createExponentialRampToValueAutomationEvent(2, 1);

        expect(exponentialRampToValueAutomationEvent.value).to.equal(2);
    });
});
