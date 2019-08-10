import { createSetTargetAutomationEvent } from '../../../src/functions/create-set-target-automation-event';

describe('createSetTargetAutomationEvent()', () => {

    it('should return an object which implements the ISetTargetAutomationEvent interface', () => {
        const setTargetAtTimeAutomationEvent = createSetTargetAutomationEvent(2, 1, 3);

        expect(setTargetAtTimeAutomationEvent.startTime).to.be.a('number');
        expect(setTargetAtTimeAutomationEvent.target).to.be.a('number');
        expect(setTargetAtTimeAutomationEvent.type).to.equal('setTarget');
        expect(setTargetAtTimeAutomationEvent.timeConstant).to.be.a('number');
    });

    it('should return an object with the given startTime', () => {
        const setTargetAtTimeAutomationEvent = createSetTargetAutomationEvent(2, 1, 3);

        expect(setTargetAtTimeAutomationEvent.startTime).to.equal(1);
    });

    it('should return an object with the given target', () => {
        const setTargetAtTimeAutomationEvent = createSetTargetAutomationEvent(2, 1, 3);

        expect(setTargetAtTimeAutomationEvent.target).to.equal(2);
    });

    it('should return an object with the given timeConstant', () => {
        const setTargetAtTimeAutomationEvent = createSetTargetAutomationEvent(2, 1, 3);

        expect(setTargetAtTimeAutomationEvent.timeConstant).to.equal(3);
    });

});
