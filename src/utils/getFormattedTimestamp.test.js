import * as formatTimeModule from './formatTime';
import * as formatDateModule from './formatDate';
import { getFormattedTimestamp } from './getFormattedTimestamp';

const formatTimeMock = jest.spyOn(formatTimeModule, 'formatTime');
const formatDateMock = jest.spyOn(formatDateModule, 'formatDate');;

it('calls formatTime if the timestamp passed to it is from the current day', () => {
    const currentTimestamp = new Date().toISOString();
    getFormattedTimestamp(currentTimestamp);
    expect(formatTimeMock).toHaveBeenCalledTimes(1);
    expect(formatTimeMock.mock.calls[0][0] instanceof Date).toBe(true);
});
it('calls formatDate if the timestamp is older than the current day', () => {
    const olderTimestamp = '2019-07-03T20:38:10.893Z';
    getFormattedTimestamp(olderTimestamp);
    expect(formatDateMock).toHaveBeenCalledTimes(1);
    expect(formatDateMock.mock.calls[0][0] instanceof Date).toBe(true);
});
