import {
  transformRequestFilterOptions,
} from './utils';

describe('transformRequestFilterOptions', () => {
  const formatMessage = jest.fn(({ id }) => id);
  const option = {
    label: 'label',
    value: 'value',
  };

  it('should return data options', () => {
    expect(transformRequestFilterOptions(formatMessage, [option])).toEqual([option]);
  });

  it('should not return data options', () => {
    expect(transformRequestFilterOptions(formatMessage)).toEqual([]);
  });
});
