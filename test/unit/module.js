import {
    AutomationEventList,
    createCancelAndHoldAutomationEvent,
    createCancelScheduledValuesAutomationEvent,
    createExponentialRampToValueAutomationEvent,
    createLinearRampToValueAutomationEvent,
    createSetTargetAutomationEvent,
    createSetValueAutomationEvent,
    createSetValueCurveAutomationEvent
} from '../../src/module';
import { describe, expect, it } from 'vitest';

describe('automation-events', () => {
    describe('AutomationEventList', () => {
        it('should export the AutomationEventList class', () => {
            expect(AutomationEventList).to.a('function');
        });
    });

    describe('createCancelAndHoldAutomationEvent()', () => {
        it('should export the createCancelAndHoldAutomationEvent() function', () => {
            expect(createCancelAndHoldAutomationEvent).to.a('function');
        });
    });

    describe('createCancelScheduledValuesAutomationEvent()', () => {
        it('should export the createCancelScheduledValuesAutomationEvent() function', () => {
            expect(createCancelScheduledValuesAutomationEvent).to.a('function');
        });
    });

    describe('createExponentialRampToValueAutomationEvent()', () => {
        it('should export the createExponentialRampToValueAutomationEvent() function', () => {
            expect(createExponentialRampToValueAutomationEvent).to.a('function');
        });
    });

    describe('createLinearRampToValueAutomationEvent()', () => {
        it('should export the createLinearRampToValueAutomationEvent() function', () => {
            expect(createLinearRampToValueAutomationEvent).to.a('function');
        });
    });

    describe('createSetTargetAutomationEvent()', () => {
        it('should export the createSetTargetAutomationEvent() function', () => {
            expect(createSetTargetAutomationEvent).to.a('function');
        });
    });

    describe('createSetValueAutomationEvent()', () => {
        it('should export the createSetValueAutomationEvent() function', () => {
            expect(createSetValueAutomationEvent).to.a('function');
        });
    });

    describe('createSetValueCurveAutomationEvent()', () => {
        it('should export the createSetValueCurveAutomationEvent() function', () => {
            expect(createSetValueCurveAutomationEvent).to.a('function');
        });
    });
});
