import { formatTime } from './formatTime';

it('takes a date object and formats it into a time string', () => {
    expect(formatTime(new Date('2019-12-13T20:38:10.893Z')))
    .toBe('20:38');
});
it('pads the minutes value with a 0 if less than 10', () => {
    expect(formatTime(new Date('2019-12-13T20:07:10.893Z')))
    .toBe('20:07');
});
