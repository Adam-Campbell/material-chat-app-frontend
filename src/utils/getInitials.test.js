import { getInitials } from './getInitials';

it('takes the first letter of a single word string and capitalizes it', () => {
    expect(getInitials('joebloggs')).toBe('J');
});

it('takes the first letter from the first two words of a multi word string and capitalizes them', () => {
    expect(getInitials('joe bloggs')).toBe('JB');
    expect(getInitials('joe bloggs with extra words')).toBe('JB');
});
