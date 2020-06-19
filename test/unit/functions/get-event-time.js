import { createCancelAndHoldAutomationEvent } from '../../../src/functions/create-cancel-and-hold-automation-event';
import { createCancelScheduledValuesAutomationEvent } from '../../../src/functions/create-cancel-scheduled-values-automation-event';
import { createExponentialRampToValueAutomationEvent } from '../../../src/functions/create-exponential-ramp-to-value-automation-event';
import { createLinearRampToValueAutomationEvent } from '../../../src/functions/create-linear-ramp-to-value-automation-event';
import { createSetTargetAutomationEvent } from '../../../src/functions/create-set-target-automation-event';
import { createSetValueAutomationEvent } from '../../../src/functions/create-set-value-automation-event';
import { createSetValueCurveAutomationEvent } from '../../../src/functions/create-set-value-curve-automation-event';
import { getEventTime } from '../../../src/functions/get-event-time';

describe('getEventTime()', () => {
    describe('with an event of type cancelAndHold', () => {
        let automationEvent;

        beforeEach(() => {
            automationEvent = createCancelAndHoldAutomationEvent(2);
        });

        it('should return the cancelTime', () => {
            expect(getEventTime(automationEvent)).to.equal(2);
        });
    });

    describe('with an event of type cancelScheduledValues', () => {
        let automationEvent;

        beforeEach(() => {
            automationEvent = createCancelScheduledValuesAutomationEvent(11);
        });

        it('should return the cancelTime', () => {
            expect(getEventTime(automationEvent)).to.equal(11);
        });
    });

    describe('with an event of type exponentialRampToValue', () => {
        let automationEvent;

        beforeEach(() => {
            automationEvent = createExponentialRampToValueAutomationEvent(1, 12);
        });

        it('should return the endTime', () => {
            expect(getEventTime(automationEvent)).to.equal(12);
        });
    });

    describe('with an event of type linearRampToValue', () => {
        let automationEvent;

        beforeEach(() => {
            automationEvent = createLinearRampToValueAutomationEvent(1, 12);
        });

        it('should return the endTime', () => {
            expect(getEventTime(automationEvent)).to.equal(12);
        });
    });

    describe('with an event of type setTarget', () => {
        let automationEvent;

        beforeEach(() => {
            automationEvent = createSetTargetAutomationEvent(1, 12, 0.5);
        });

        it('should return the startTime', () => {
            expect(getEventTime(automationEvent)).to.equal(12);
        });
    });

    describe('with an event of type setValue', () => {
        let automationEvent;

        beforeEach(() => {
            automationEvent = createSetValueAutomationEvent(1, 12);
        });

        it('should return the startTime', () => {
            expect(getEventTime(automationEvent)).to.equal(12);
        });
    });

    describe('with an event of type setValueCurve', () => {
        let automationEvent;

        beforeEach(() => {
            automationEvent = createSetValueCurveAutomationEvent(new Float32Array([5, 4, 3]), 12, 4);
        });

        it('should return the startTime', () => {
            expect(getEventTime(automationEvent)).to.equal(12);
        });
    });
});
