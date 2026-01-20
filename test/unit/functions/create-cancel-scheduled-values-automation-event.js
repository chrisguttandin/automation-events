import { describe, expect, it } from 'vitest';
import { createCancelScheduledValuesAutomationEvent } from '../../../src/functions/create-cancel-scheduled-values-automation-event';

describe('createCancelScheduledValuesAutomationEvent()', () => {
    it('should return an object which implements the ICancelScheduledValuesAutomationEvent interface', () => {
        const cancelScheduledValuesAutomationEvent = createCancelScheduledValuesAutomationEvent(2);

        expect(cancelScheduledValuesAutomationEvent.cancelTime).to.be.a('number');
        expect(cancelScheduledValuesAutomationEvent.type).to.equal('cancelScheduledValues');
    });

    it('should return an object with the given cancelTime', () => {
        const cancelScheduledValuesAutomationEvent = createCancelScheduledValuesAutomationEvent(2);

        expect(cancelScheduledValuesAutomationEvent.cancelTime).to.equal(2);
    });
});
