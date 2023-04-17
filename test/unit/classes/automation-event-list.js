import { AutomationEventList } from '../../../src/classes/automation-event-list';
import { createCancelAndHoldAutomationEvent } from '../../../src/functions/create-cancel-and-hold-automation-event';
import { createCancelScheduledValuesAutomationEvent } from '../../../src/functions/create-cancel-scheduled-values-automation-event';
import { createExponentialRampToValueAutomationEvent } from '../../../src/functions/create-exponential-ramp-to-value-automation-event';
import { createLinearRampToValueAutomationEvent } from '../../../src/functions/create-linear-ramp-to-value-automation-event';
import { createSetTargetAutomationEvent } from '../../../src/functions/create-set-target-automation-event';
import { createSetValueAutomationEvent } from '../../../src/functions/create-set-value-automation-event';
import { createSetValueCurveAutomationEvent } from '../../../src/functions/create-set-value-curve-automation-event';
import { interpolateValue } from '../../../src/functions/interpolate-value';

describe('AutomationEventList', () => {
    describe('add()', () => {
        let automationEventList;
        let defaultValue;

        beforeEach(() => {
            defaultValue = Math.random();
            automationEventList = new AutomationEventList(defaultValue);
        });

        describe('with an event of type cancelAndHold', () => {
            beforeEach(() => {
                automationEventList.add(createSetValueAutomationEvent(1, 12));
                automationEventList.add(createSetValueAutomationEvent(0, 10));
            });

            it('should remove events with an event time above the cancelTime', () => {
                expect(automationEventList.add(createCancelAndHoldAutomationEvent(11))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([{ startTime: 10, type: 'setValue', value: 0 }]);
            });

            it('should remove events with an event time that equals the cancelTime', () => {
                expect(automationEventList.add(createCancelAndHoldAutomationEvent(12))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([{ startTime: 10, type: 'setValue', value: 0 }]);
            });

            describe('with an event of type exponentialRampToValue with an endTime after cancelTime', () => {
                beforeEach(() => {
                    automationEventList.add(createExponentialRampToValueAutomationEvent(0.75, 11.5));
                });

                it('should truncate the exponentialRampToValue automation by replacing it', () => {
                    expect(automationEventList.add(createCancelAndHoldAutomationEvent(11))).to.be.true;

                    expect(Array.from(automationEventList)).to.deep.equal([
                        { startTime: 10, type: 'setValue', value: 0 },
                        { endTime: 11, insertTime: 0, type: 'exponentialRampToValue', value: 0 }
                    ]);
                });
            });

            describe('with an event of type linearRampToValue with an endTime after cancelTime', () => {
                beforeEach(() => {
                    automationEventList.add(createLinearRampToValueAutomationEvent(0.75, 11.5));
                });

                it('should truncate the linearRampToValue automation by replacing it', () => {
                    expect(automationEventList.add(createCancelAndHoldAutomationEvent(11))).to.be.true;

                    expect(Array.from(automationEventList)).to.deep.equal([
                        { startTime: 10, type: 'setValue', value: 0 },
                        { endTime: 11, insertTime: 0, type: 'linearRampToValue', value: 0.5 }
                    ]);
                });
                // });
            });

            describe('with an event of type setValueCurve with a startTime before cancelTime', () => {
                describe('with a curve with three values', () => {
                    beforeEach(() => {
                        automationEventList.add(createSetValueCurveAutomationEvent(new Float32Array([6, 7, 8]), 10, 2));
                    });

                    it('should truncate the setValueCurve automation by replacing it with a sliced curve', () => {
                        expect(automationEventList.add(createCancelAndHoldAutomationEvent(11))).to.be.true;

                        expect(Array.from(automationEventList)).to.deep.equal([
                            { startTime: 10, type: 'setValue', value: 0 },
                            { duration: 1, startTime: 10, type: 'setValueCurve', values: new Float32Array([6, 7]) }
                        ]);
                    });

                    it('should truncate the setValueCurve automation by replacing it with an interpolated curve', () => {
                        expect(automationEventList.add(createCancelAndHoldAutomationEvent(11.5))).to.be.true;

                        expect(Array.from(automationEventList)).to.deep.equal([
                            { startTime: 10, type: 'setValue', value: 0 },
                            { duration: 1.5, startTime: 10, type: 'setValueCurve', values: new Float32Array([6, 6.75, 7.5]) }
                        ]);
                    });
                });

                describe('with a curve with two values', () => {
                    beforeEach(() => {
                        automationEventList.add(createSetValueCurveAutomationEvent(new Float32Array([6, 8]), 10, 2));
                    });

                    it('should truncate the setValueCurve automation by replacing it with a sliced curve', () => {
                        expect(automationEventList.add(createCancelAndHoldAutomationEvent(11))).to.be.true;

                        expect(Array.from(automationEventList)).to.deep.equal([
                            { startTime: 10, type: 'setValue', value: 0 },
                            { duration: 1, startTime: 10, type: 'setValueCurve', values: new Float32Array([6, 7]) }
                        ]);
                    });

                    it('should truncate the setValueCurve automation by replacing it with an interpolated curve', () => {
                        expect(automationEventList.add(createCancelAndHoldAutomationEvent(11.5))).to.be.true;

                        expect(Array.from(automationEventList)).to.deep.equal([
                            { startTime: 10, type: 'setValue', value: 0 },
                            { duration: 1.5, startTime: 10, type: 'setValueCurve', values: new Float32Array([6, 7.5]) }
                        ]);
                    });
                });
            });

            describe('with an event of type setTarget with a startTime before cancelTime', () => {
                let target;

                beforeEach(() => {
                    target = Math.random();

                    automationEventList.add(createSetTargetAutomationEvent(target, 10, 1));
                });

                it('should stop the setTarget automation by adding an event of type setValue', () => {
                    expect(automationEventList.add(createCancelAndHoldAutomationEvent(11))).to.be.true;

                    expect(Array.from(automationEventList)).to.deep.equal([
                        { startTime: 10, type: 'setValue', value: 0 },
                        { startTime: 10, target, timeConstant: 1, type: 'setTarget' },
                        { startTime: 11, type: 'setValue', value: target - target * Math.exp(-1) }
                    ]);
                });
            });
        });

        describe('with an event of type cancelScheduledValues', () => {
            beforeEach(() => {
                automationEventList.add(createSetValueAutomationEvent(1, 12));
                automationEventList.add(createSetValueAutomationEvent(0, 10));
            });

            it('should remove events with an event time above the cancelTime', () => {
                expect(automationEventList.add(createCancelScheduledValuesAutomationEvent(11))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([{ startTime: 10, type: 'setValue', value: 0 }]);
            });

            it('should remove events with an event time that equals the cancelTime', () => {
                expect(automationEventList.add(createCancelScheduledValuesAutomationEvent(12))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([{ startTime: 10, type: 'setValue', value: 0 }]);
            });

            describe('with an event of type setValueCurve with a startTime before cancelTime', () => {
                beforeEach(() => {
                    automationEventList.add(createSetValueCurveAutomationEvent(new Float32Array([6, 7, 8]), 10, 2));
                });

                it('should remove the setValueCurve automation event', () => {
                    expect(automationEventList.add(createCancelScheduledValuesAutomationEvent(11))).to.be.true;

                    expect(Array.from(automationEventList)).to.deep.equal([{ startTime: 10, type: 'setValue', value: 0 }]);
                });
            });
        });

        describe('with an event of type exponentialRampToValue', () => {
            beforeEach(() => {
                automationEventList.add(createExponentialRampToValueAutomationEvent(1, 12));
            });

            it('should order events by their event time', () => {
                expect(automationEventList.add(createExponentialRampToValueAutomationEvent(0, 10))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { endTime: 10, insertTime: 0, type: 'exponentialRampToValue', value: 0 },
                    { endTime: 12, insertTime: 0, type: 'exponentialRampToValue', value: 1 }
                ]);
            });

            it('should order events with the same event time after each other', () => {
                expect(automationEventList.add(createExponentialRampToValueAutomationEvent(0, 12))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { endTime: 12, insertTime: 0, type: 'exponentialRampToValue', value: 1 },
                    { endTime: 12, insertTime: 0, type: 'exponentialRampToValue', value: 0 }
                ]);
            });

            it('should not add an event which has an event time that overlaps with a previous event of type setValueCurve', () => {
                const values = new Float32Array([5, 4, 3]);

                automationEventList.add(createSetValueCurveAutomationEvent(values, 13, 2));

                expect(automationEventList.add(createExponentialRampToValueAutomationEvent(0, 14))).to.be.false;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { endTime: 12, insertTime: 0, type: 'exponentialRampToValue', value: 1 },
                    { duration: 2, startTime: 13, type: 'setValueCurve', values }
                ]);
            });
        });

        describe('with an event of type linearRampToValue', () => {
            beforeEach(() => {
                automationEventList.add(createLinearRampToValueAutomationEvent(1, 12));
            });

            it('should order events by their event time', () => {
                expect(automationEventList.add(createLinearRampToValueAutomationEvent(0, 10))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { endTime: 10, insertTime: 0, type: 'linearRampToValue', value: 0 },
                    { endTime: 12, insertTime: 0, type: 'linearRampToValue', value: 1 }
                ]);
            });

            it('should order events with the same event time after each other', () => {
                expect(automationEventList.add(createLinearRampToValueAutomationEvent(0, 12))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { endTime: 12, insertTime: 0, type: 'linearRampToValue', value: 1 },
                    { endTime: 12, insertTime: 0, type: 'linearRampToValue', value: 0 }
                ]);
            });

            it('should not add an event which has an event time that overlaps with a previous event of type setValueCurve', () => {
                const values = new Float32Array([5, 4, 3]);

                automationEventList.add(createSetValueCurveAutomationEvent(values, 13, 2));

                expect(automationEventList.add(createLinearRampToValueAutomationEvent(0, 14))).to.be.false;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { endTime: 12, insertTime: 0, type: 'linearRampToValue', value: 1 },
                    { duration: 2, startTime: 13, type: 'setValueCurve', values }
                ]);
            });
        });

        describe('with an event of type setTarget', () => {
            beforeEach(() => {
                automationEventList.add(createSetTargetAutomationEvent(1, 12, 0.5));
            });

            it('should order events by their event time', () => {
                expect(automationEventList.add(createSetTargetAutomationEvent(0, 10, 0.3))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 10, target: 0, timeConstant: 0.3, type: 'setTarget' },
                    { startTime: 12, target: 1, timeConstant: 0.5, type: 'setTarget' }
                ]);
            });

            it('should order events with the same event time after each other', () => {
                expect(automationEventList.add(createSetTargetAutomationEvent(0, 12, 0.3))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 12, target: 1, timeConstant: 0.5, type: 'setTarget' },
                    { startTime: 12, target: 0, timeConstant: 0.3, type: 'setTarget' }
                ]);
            });

            it('should not add an event which has an event time that overlaps with a previous event of type setValueCurve', () => {
                const values = new Float32Array([5, 4, 3]);

                automationEventList.add(createSetValueCurveAutomationEvent(values, 13, 2));

                expect(automationEventList.add(createSetTargetAutomationEvent(0, 14, 0.3))).to.be.false;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 12, target: 1, timeConstant: 0.5, type: 'setTarget' },
                    { duration: 2, startTime: 13, type: 'setValueCurve', values }
                ]);
            });
        });

        describe('with an event of type setValue', () => {
            beforeEach(() => {
                automationEventList.add(createSetValueAutomationEvent(1, 12));
            });

            it('should order events by their event time', () => {
                expect(automationEventList.add(createSetValueAutomationEvent(0, 10))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 10, type: 'setValue', value: 0 },
                    { startTime: 12, type: 'setValue', value: 1 }
                ]);
            });

            it('should order events with the same event time after each other', () => {
                expect(automationEventList.add(createSetValueAutomationEvent(0, 12))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 12, type: 'setValue', value: 1 },
                    { startTime: 12, type: 'setValue', value: 0 }
                ]);
            });

            it('should not add an event which has an event time that overlaps with a previous event of type setValueCurve', () => {
                const values = new Float32Array([5, 4, 3]);

                automationEventList.add(createSetValueCurveAutomationEvent(values, 13, 2));

                expect(automationEventList.add(createSetValueAutomationEvent(0, 14))).to.be.false;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 12, type: 'setValue', value: 1 },
                    { duration: 2, startTime: 13, type: 'setValueCurve', values }
                ]);
            });
        });

        describe('with an event of type setValueCurve', () => {
            let values;

            beforeEach(() => {
                values = [new Float32Array([5, 4, 3]), new Float32Array([4, 5, 6])];

                automationEventList.add(createSetValueCurveAutomationEvent(values[0], 12, 4));
            });

            it('should order events by their event time', () => {
                expect(automationEventList.add(createSetValueCurveAutomationEvent(values[1], 10, 2))).to.be.true;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { duration: 2, startTime: 10, type: 'setValueCurve', values: values[1] },
                    { duration: 4, startTime: 12, type: 'setValueCurve', values: values[0] }
                ]);
            });

            it('should not add an event with the same event time as a previous event of type setValueCurve', () => {
                expect(automationEventList.add(createSetValueAutomationEvent(2, 12))).to.be.false;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { duration: 4, startTime: 12, type: 'setValueCurve', values: values[0] }
                ]);
            });

            it('should not add an event which lasts longer than the event time of the following event', () => {
                expect(automationEventList.add(createSetValueCurveAutomationEvent(values[1], 10, 5))).to.be.false;

                expect(Array.from(automationEventList)).to.deep.equal([
                    { duration: 4, startTime: 12, type: 'setValueCurve', values: values[0] }
                ]);
            });
        });
    });

    describe('flush()', () => {
        describe('with events of type setTarget', () => {
            let automationEventList;

            beforeEach(() => {
                automationEventList = new AutomationEventList(1);

                automationEventList.add(createSetTargetAutomationEvent(1, 12, 4));
                automationEventList.add(createSetTargetAutomationEvent(0, 10, 2));
                automationEventList.add(createSetTargetAutomationEvent(0, 16, 3));
                automationEventList.add(createSetTargetAutomationEvent(1, 8, 6));
                automationEventList.add(createSetTargetAutomationEvent(1, 14, 1));
            });

            it('should flush all events up to the given time', () => {
                automationEventList.flush(12);

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 12, type: 'setValue', value: 0.36787944117144233 },
                    { startTime: 12, target: 1, timeConstant: 4, type: 'setTarget' },
                    { startTime: 14, target: 1, timeConstant: 1, type: 'setTarget' },
                    { startTime: 16, target: 0, timeConstant: 3, type: 'setTarget' }
                ]);
            });

            it('should flush only events which do not influence the value anymore after the given time', () => {
                automationEventList.flush(13);

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 12, type: 'setValue', value: 0.36787944117144233 },
                    { startTime: 12, target: 1, timeConstant: 4, type: 'setTarget' },
                    { startTime: 14, target: 1, timeConstant: 1, type: 'setTarget' },
                    { startTime: 16, target: 0, timeConstant: 3, type: 'setTarget' }
                ]);
            });
        });

        describe('with events of type setValue', () => {
            let automationEventList;

            beforeEach(() => {
                automationEventList = new AutomationEventList(Math.random());

                automationEventList.add(createSetValueAutomationEvent(1, 12));
                automationEventList.add(createSetValueAutomationEvent(0, 10));
                automationEventList.add(createSetValueAutomationEvent(0, 16));
                automationEventList.add(createSetValueAutomationEvent(-1, 8));
                automationEventList.add(createSetValueAutomationEvent(-1, 14));
            });

            it('should flush all events up to the given time', () => {
                automationEventList.flush(12);

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 12, type: 'setValue', value: 1 },
                    { startTime: 14, type: 'setValue', value: -1 },
                    { startTime: 16, type: 'setValue', value: 0 }
                ]);
            });

            it('should flush only events which do not influence the value anymore after the given time', () => {
                automationEventList.flush(13);

                expect(Array.from(automationEventList)).to.deep.equal([
                    { startTime: 12, type: 'setValue', value: 1 },
                    { startTime: 14, type: 'setValue', value: -1 },
                    { startTime: 16, type: 'setValue', value: 0 }
                ]);
            });
        });
    });

    describe('getValue()', () => {
        let automationEventList;
        let defaultValue;

        beforeEach(() => {
            defaultValue = Math.random();
            automationEventList = new AutomationEventList(defaultValue);
        });

        describe('without any event', () => {
            it('should return the defaultValue', () => {
                expect(automationEventList.getValue(Math.random())).to.equal(defaultValue);
            });
        });

        describe('without a previous event', () => {
            describe('with an event of type exponentialRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = Math.random();

                    automationEventList.add(createExponentialRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = endTime * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(defaultValue * (value / defaultValue) ** (time / endTime));
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type linearRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = Math.random();

                    automationEventList.add(createLinearRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = endTime * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(defaultValue + (time / endTime) * (value - defaultValue));
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setTarget', () => {
                let startTime;
                let target;
                let timeConstant;

                beforeEach(() => {
                    startTime = Math.random();
                    target = Math.random();
                    timeConstant = Math.random();

                    automationEventList.add(createSetTargetAutomationEvent(target, startTime, timeConstant));
                });

                it('should return the defaultValue before the startTime', () => {
                    const time = startTime * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(defaultValue);
                });

                it('should return the modified value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        target + (defaultValue - target) * Math.exp((startTime - time) / timeConstant)
                    );
                });
            });

            describe('with an event of type setValue', () => {
                let startTime;
                let value;

                beforeEach(() => {
                    startTime = Math.random();
                    value = Math.random();

                    automationEventList.add(createSetValueAutomationEvent(value, startTime));
                });

                it('should return the defaultValue before the startTime', () => {
                    const time = startTime * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(defaultValue);
                });

                it('should return the value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setValueCurve', () => {
                let duration;
                let startTime;
                let values;

                beforeEach(() => {
                    duration = Math.random();
                    startTime = Math.random();
                    values = new Float32Array([0, 1]);

                    automationEventList.add(createSetValueCurveAutomationEvent(values, startTime, duration));
                });

                it('should return the defaultValue before the startTime', () => {
                    const time = startTime * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(defaultValue);
                });

                it('should return an interpolated value during the duration', () => {
                    const time = startTime + Math.random() * duration;

                    expect(automationEventList.getValue(time)).to.equal(interpolateValue(values, (time - startTime) / duration));
                });

                it('should return the value of the last bin after the event', () => {
                    const time = startTime + duration + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(values[values.length - 1]);
                });
            });
        });

        describe('with a previous event of type exponentialRampToValue', () => {
            let exponentialRampToValueAutomationEvent;
            let offset;

            beforeEach(() => {
                const endTime = Math.random();

                exponentialRampToValueAutomationEvent = createExponentialRampToValueAutomationEvent(Math.random(), endTime);
                offset = endTime;

                automationEventList.add(exponentialRampToValueAutomationEvent);
            });

            describe('with an event of type exponentialRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createExponentialRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        exponentialRampToValueAutomationEvent.value *
                            (value / exponentialRampToValueAutomationEvent.value) ** ((time - offset) / (endTime - offset))
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type linearRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createLinearRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        exponentialRampToValueAutomationEvent.value +
                            ((time - offset) / (endTime - offset)) * (value - exponentialRampToValueAutomationEvent.value)
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setTarget', () => {
                let startTime;
                let target;
                let timeConstant;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    target = Math.random();
                    timeConstant = Math.random();

                    automationEventList.add(createSetTargetAutomationEvent(target, startTime, timeConstant));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(exponentialRampToValueAutomationEvent.value);
                });

                it('should return the modified value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        target + (exponentialRampToValueAutomationEvent.value - target) * Math.exp((startTime - time) / timeConstant)
                    );
                });
            });

            describe('with an event of type setValue', () => {
                let startTime;
                let value;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    value = Math.random();

                    automationEventList.add(createSetValueAutomationEvent(value, startTime));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(exponentialRampToValueAutomationEvent.value);
                });

                it('should return the value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setValueCurve', () => {
                let duration;
                let startTime;
                let values;

                beforeEach(() => {
                    duration = Math.random();
                    startTime = offset + Math.random();
                    values = new Float32Array([0, 1]);

                    automationEventList.add(createSetValueCurveAutomationEvent(values, startTime, duration));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(exponentialRampToValueAutomationEvent.value);
                });

                it('should return an interpolated value during the duration', () => {
                    const time = startTime + Math.random() * duration;

                    expect(automationEventList.getValue(time)).to.equal(interpolateValue(values, (time - startTime) / duration));
                });

                it('should return the value of the last bin after the event', () => {
                    const time = startTime + duration + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(values[values.length - 1]);
                });
            });
        });

        describe('with a previous event of type linearRampToValue', () => {
            let linearRampToValueAutomationEvent;
            let offset;

            beforeEach(() => {
                const endTime = Math.random();

                linearRampToValueAutomationEvent = createLinearRampToValueAutomationEvent(Math.random(), endTime);
                offset = endTime;

                automationEventList.add(linearRampToValueAutomationEvent);
            });

            describe('with an event of type exponentialRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createExponentialRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        linearRampToValueAutomationEvent.value *
                            (value / linearRampToValueAutomationEvent.value) ** ((time - offset) / (endTime - offset))
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type linearRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createLinearRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        linearRampToValueAutomationEvent.value +
                            ((time - offset) / (endTime - offset)) * (value - linearRampToValueAutomationEvent.value)
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setTarget', () => {
                let startTime;
                let target;
                let timeConstant;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    target = Math.random();
                    timeConstant = Math.random();

                    automationEventList.add(createSetTargetAutomationEvent(target, startTime, timeConstant));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(linearRampToValueAutomationEvent.value);
                });

                it('should return the modified value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        target + (linearRampToValueAutomationEvent.value - target) * Math.exp((startTime - time) / timeConstant)
                    );
                });
            });

            describe('with an event of type setValue', () => {
                let startTime;
                let value;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    value = Math.random();

                    automationEventList.add(createSetValueAutomationEvent(value, startTime));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(linearRampToValueAutomationEvent.value);
                });

                it('should return the value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setValueCurve', () => {
                let duration;
                let startTime;
                let values;

                beforeEach(() => {
                    duration = Math.random();
                    startTime = offset + Math.random();
                    values = new Float32Array([0, 1]);

                    automationEventList.add(createSetValueCurveAutomationEvent(values, startTime, duration));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(linearRampToValueAutomationEvent.value);
                });

                it('should return an interpolated value during the duration', () => {
                    const time = startTime + Math.random() * duration;

                    expect(automationEventList.getValue(time)).to.equal(interpolateValue(values, (time - startTime) / duration));
                });

                it('should return the value of the last bin after the event', () => {
                    const time = startTime + duration + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(values[values.length - 1]);
                });
            });
        });

        describe('with a previous event of type setTarget', () => {
            let offset;
            let setTargetAutomationEvent;

            beforeEach(() => {
                const startTime = Math.random();

                offset = startTime;
                setTargetAutomationEvent = createSetTargetAutomationEvent(Math.random(), startTime, Math.random());

                automationEventList.add(setTargetAutomationEvent);
            });

            describe('with an event of type exponentialRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createExponentialRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        defaultValue * (value / defaultValue) ** ((time - offset) / (endTime - offset))
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type linearRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createLinearRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        defaultValue + ((time - offset) / (endTime - offset)) * (value - defaultValue)
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setTarget', () => {
                let startTime;
                let target;
                let timeConstant;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    target = Math.random();
                    timeConstant = Math.random();

                    automationEventList.add(createSetTargetAutomationEvent(target, startTime, timeConstant));
                });

                it('should return the modified value as defined by the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setTargetAutomationEvent.target +
                            (defaultValue - setTargetAutomationEvent.target) *
                                Math.exp((setTargetAutomationEvent.startTime - time) / setTargetAutomationEvent.timeConstant)
                    );
                });

                it('should return the modified value from the startTime onwards', () => {
                    const initialValue =
                        setTargetAutomationEvent.target +
                        (defaultValue - setTargetAutomationEvent.target) *
                            Math.exp((setTargetAutomationEvent.startTime - startTime) / setTargetAutomationEvent.timeConstant);
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        target + (initialValue - target) * Math.exp((startTime - time) / timeConstant)
                    );
                });
            });

            describe('with an event of type setValue', () => {
                let startTime;
                let value;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    value = Math.random();

                    automationEventList.add(createSetValueAutomationEvent(value, startTime));
                });

                it('should return the modified value as defined by the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setTargetAutomationEvent.target +
                            (defaultValue - setTargetAutomationEvent.target) *
                                Math.exp((setTargetAutomationEvent.startTime - time) / setTargetAutomationEvent.timeConstant)
                    );
                });

                it('should return the value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setValueCurve', () => {
                let duration;
                let startTime;
                let values;

                beforeEach(() => {
                    duration = Math.random();
                    startTime = offset + Math.random();
                    values = new Float32Array([0, 1]);

                    automationEventList.add(createSetValueCurveAutomationEvent(values, startTime, duration));
                });

                it('should return the modified value as defined by the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setTargetAutomationEvent.target +
                            (defaultValue - setTargetAutomationEvent.target) *
                                Math.exp((setTargetAutomationEvent.startTime - time) / setTargetAutomationEvent.timeConstant)
                    );
                });

                it('should return an interpolated value during the duration', () => {
                    const time = startTime + Math.random() * duration;

                    expect(automationEventList.getValue(time)).to.equal(interpolateValue(values, (time - startTime) / duration));
                });

                it('should return the value of the last bin after the event', () => {
                    const time = startTime + duration + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(values[values.length - 1]);
                });
            });
        });

        describe('with a previous event of type setValue', () => {
            let offset;
            let setValueAutomationEvent;

            beforeEach(() => {
                const startTime = Math.random();

                offset = startTime;
                setValueAutomationEvent = createSetValueAutomationEvent(Math.random(), startTime);

                automationEventList.add(setValueAutomationEvent);
            });

            describe('with an event of type exponentialRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createExponentialRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setValueAutomationEvent.value * (value / setValueAutomationEvent.value) ** ((time - offset) / (endTime - offset))
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type linearRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createLinearRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setValueAutomationEvent.value + ((time - offset) / (endTime - offset)) * (value - setValueAutomationEvent.value)
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setTarget', () => {
                let startTime;
                let target;
                let timeConstant;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    target = Math.random();
                    timeConstant = Math.random();

                    automationEventList.add(createSetTargetAutomationEvent(target, startTime, timeConstant));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(setValueAutomationEvent.value);
                });

                it('should return the modified value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        target + (setValueAutomationEvent.value - target) * Math.exp((startTime - time) / timeConstant)
                    );
                });
            });

            describe('with an event of type setValue', () => {
                let startTime;
                let value;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    value = Math.random();

                    automationEventList.add(createSetValueAutomationEvent(value, startTime));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(setValueAutomationEvent.value);
                });

                it('should return the value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setValueCurve', () => {
                let duration;
                let startTime;
                let values;

                beforeEach(() => {
                    duration = Math.random();
                    startTime = offset + Math.random();
                    values = new Float32Array([0, 1]);

                    automationEventList.add(createSetValueCurveAutomationEvent(values, startTime, duration));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(setValueAutomationEvent.value);
                });

                it('should return an interpolated value during the duration', () => {
                    const time = startTime + Math.random() * duration;

                    expect(automationEventList.getValue(time)).to.equal(interpolateValue(values, (time - startTime) / duration));
                });

                it('should return the value of the last bin after the event', () => {
                    const time = startTime + duration + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(values[values.length - 1]);
                });
            });
        });

        describe('with a previous event of type setValueCurve', () => {
            let offset;
            let setValueCurveAutomationEvent;

            beforeEach(() => {
                const duration = Math.random();
                const startTime = Math.random();

                offset = startTime + duration;
                setValueCurveAutomationEvent = createSetValueCurveAutomationEvent(new Float32Array([0, 1]), startTime, duration);

                automationEventList.add(setValueCurveAutomationEvent);
            });

            describe('with an event of type exponentialRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createExponentialRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setValueCurveAutomationEvent.values[setValueCurveAutomationEvent.values.length - 1] *
                            (value / setValueCurveAutomationEvent.values[setValueCurveAutomationEvent.values.length - 1]) **
                                ((time - offset) / (endTime - offset))
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type linearRampToValue', () => {
                let value;
                let endTime;

                beforeEach(() => {
                    value = Math.random();
                    endTime = offset + Math.random();

                    automationEventList.add(createLinearRampToValueAutomationEvent(value, endTime));
                });

                it('should return the modified value before the endTime', () => {
                    const time = offset + (endTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setValueCurveAutomationEvent.values[setValueCurveAutomationEvent.values.length - 1] +
                            ((time - offset) / (endTime - offset)) *
                                (value - setValueCurveAutomationEvent.values[setValueCurveAutomationEvent.values.length - 1])
                    );
                });

                it('should return the value from the endTime onwards', () => {
                    const time = endTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setTarget', () => {
                let startTime;
                let target;
                let timeConstant;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    target = Math.random();
                    timeConstant = Math.random();

                    automationEventList.add(createSetTargetAutomationEvent(target, startTime, timeConstant));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setValueCurveAutomationEvent.values[setValueCurveAutomationEvent.values.length - 1]
                    );
                });

                it('should return the modified value from the startTime onwards', () => {
                    const initialValue = setValueCurveAutomationEvent.values[setValueCurveAutomationEvent.values.length - 1];
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        target + (initialValue - target) * Math.exp((startTime - time) / timeConstant)
                    );
                });
            });

            describe('with an event of type setValue', () => {
                let startTime;
                let value;

                beforeEach(() => {
                    startTime = offset + Math.random();
                    value = Math.random();

                    automationEventList.add(createSetValueAutomationEvent(value, startTime));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setValueCurveAutomationEvent.values[setValueCurveAutomationEvent.values.length - 1]
                    );
                });

                it('should return the value from the startTime onwards', () => {
                    const time = startTime + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(value);
                });
            });

            describe('with an event of type setValueCurve', () => {
                let duration;
                let startTime;
                let values;

                beforeEach(() => {
                    duration = Math.random();
                    startTime = offset + Math.random();
                    values = new Float32Array([0, 1]);

                    automationEventList.add(createSetValueCurveAutomationEvent(values, startTime, duration));
                });

                it('should return the value of the previous event before the startTime', () => {
                    const time = offset + (startTime - offset) * Math.random();

                    expect(automationEventList.getValue(time)).to.equal(
                        setValueCurveAutomationEvent.values[setValueCurveAutomationEvent.values.length - 1]
                    );
                });

                it('should return an interpolated value during the duration', () => {
                    const time = startTime + Math.random() * duration;

                    expect(automationEventList.getValue(time)).to.equal(interpolateValue(values, (time - startTime) / duration));
                });

                it('should return the value of the last bin after the event', () => {
                    const time = startTime + duration + Math.random();

                    expect(automationEventList.getValue(time)).to.equal(values[values.length - 1]);
                });
            });
        });
    });
});
