import { describe, expect, it } from 'vitest';
import { createCancelAndHoldAutomationEvent } from '../../../src/functions/create-cancel-and-hold-automation-event';

describe('createCancelAndHoldAutomationEvent()', () => {
    it('should return an object which implements the ICancelAndHoldAutomationEvent interface', () => {
        const cancelAndHoldAutomationEvent = createCancelAndHoldAutomationEvent(2);

        expect(cancelAndHoldAutomationEvent.cancelTime).to.be.a('number');
        expect(cancelAndHoldAutomationEvent.type).to.equal('cancelAndHold');
    });

    it('should return an object with the given cancelTime', () => {
        const cancelAndHoldAutomationEvent = createCancelAndHoldAutomationEvent(2);

        expect(cancelAndHoldAutomationEvent.cancelTime).to.equal(2);
    });
});
