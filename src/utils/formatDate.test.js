import { formatDate } from './formatDate';

it('takes a Date object and formats it into a date string', () => {
    expect(formatDate(new Date('2019-12-13T20:38:10.893Z')))
    .toBe('13/12/2019');
});
it('pads the date and month values with a 0 if less than 10', () => {
    expect(formatDate(new Date('2019-07-03T20:38:10.893Z')))
    .toBe('03/07/2019');
});
