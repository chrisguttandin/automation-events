import { beforeEach, describe, expect, it } from 'vitest';
import { getExponentialRampValueAtTime } from '../../../src/functions/get-exponential-ramp-value-at-time';

describe('getExponentialRampValueAtTime()', () => {
    let endTime;
    let startTime;

    beforeEach(() => {
        endTime = 2;
        startTime = 0;
    });

    describe('with a positive value at the end of the ramp', () => {
        let value;

        beforeEach(() => {
            value = 8;
        });

        describe('with a value of zero at startTime', () => {
            let valueAtStartTime;

            beforeEach(() => {
                valueAtStartTime = 0;
            });

            describe('with time being the startTime', () => {
                let time;

                beforeEach(() => {
                    time = startTime;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being halfway through the ramp', () => {
                let time;

                beforeEach(() => {
                    time = 1;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being the endTime', () => {
                let time;

                beforeEach(() => {
                    time = endTime;
                });

                it('should return the value at endTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(value);
                });
            });
        });

        describe('with a positive value at startTime', () => {
            let valueAtStartTime;

            beforeEach(() => {
                valueAtStartTime = 2;
            });

            describe('with time being the startTime', () => {
                let time;

                beforeEach(() => {
                    time = startTime;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being halfway through the ramp', () => {
                let time;

                beforeEach(() => {
                    time = 1;
                });

                it('should return the computed value', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(4);
                });
            });

            describe('with time being the endTime', () => {
                let time;

                beforeEach(() => {
                    time = endTime;
                });

                it('should return the value at endTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(value);
                });
            });
        });

        describe('with a negative value at startTime', () => {
            let valueAtStartTime;

            beforeEach(() => {
                valueAtStartTime = -2;
            });

            describe('with time being the startTime', () => {
                let time;

                beforeEach(() => {
                    time = startTime;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being halfway through the ramp', () => {
                let time;

                beforeEach(() => {
                    time = 1;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being the endTime', () => {
                let time;

                beforeEach(() => {
                    time = endTime;
                });

                it('should return the value at endTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(value);
                });
            });
        });
    });

    describe('with a negative value at the end of the ramp', () => {
        let value;

        beforeEach(() => {
            value = -8;
        });

        describe('with a value of zero at startTime', () => {
            let valueAtStartTime;

            beforeEach(() => {
                valueAtStartTime = 0;
            });

            describe('with time being the startTime', () => {
                let time;

                beforeEach(() => {
                    time = startTime;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being halfway through the ramp', () => {
                let time;

                beforeEach(() => {
                    time = 1;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being the endTime', () => {
                let time;

                beforeEach(() => {
                    time = endTime;
                });

                it('should return the value at endTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(value);
                });
            });
        });

        describe('with a positive value at startTime', () => {
            let valueAtStartTime;

            beforeEach(() => {
                valueAtStartTime = 2;
            });

            describe('with time being the startTime', () => {
                let time;

                beforeEach(() => {
                    time = startTime;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being halfway through the ramp', () => {
                let time;

                beforeEach(() => {
                    time = 1;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being the endTime', () => {
                let time;

                beforeEach(() => {
                    time = endTime;
                });

                it('should return the value at endTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(value);
                });
            });
        });

        describe('with a negative value at startTime', () => {
            let valueAtStartTime;

            beforeEach(() => {
                valueAtStartTime = -2;
            });

            describe('with time being the startTime', () => {
                let time;

                beforeEach(() => {
                    time = startTime;
                });

                it('should return the value at startTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(valueAtStartTime);
                });
            });

            describe('with time being halfway through the ramp', () => {
                let time;

                beforeEach(() => {
                    time = 1;
                });

                it('should return the computed value', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(-4);
                });
            });

            describe('with time being the endTime', () => {
                let time;

                beforeEach(() => {
                    time = endTime;
                });

                it('should return the value at endTime', () => {
                    expect(getExponentialRampValueAtTime(time, startTime, valueAtStartTime, { endTime, value })).to.equal(value);
                });
            });
        });
    });
});
