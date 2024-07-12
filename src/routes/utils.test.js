import {
  parseFilters,
} from '@folio/stripes/smart-components';

import {
  buildFilterConfig,
} from './utils';

jest.mock('@folio/stripes/smart-components', () => ({
  parseFilters: jest.fn(),
}));

describe('buildFilterConfig', () => {
  const filters = 'level.Test';
  const parsedFilters = {
    level: ['Test'],
  };
  let result;

  beforeAll(() => {
    parseFilters.mockImplementation(jest.fn(() => parsedFilters));
    result = buildFilterConfig(filters);
  });

  it('should trigger parse filters with correct arguments', () => {
    expect(parseFilters).toHaveBeenCalledWith(filters);
  });

  it('should return correct data if there is no custom fields', () => {
    const expectedResult = [];

    expect(result).toEqual(expectedResult);
  });

  it('should return correct data if custom fields presented', () => {
    const expectedResult = [{
      cql: 'customFields',
      name: 'customFields',
      values: [],
      operator: '=',
    }];

    parseFilters.mockImplementationOnce(jest.fn(() => ({
      customFields: ['test'],
    })));

    expect(buildFilterConfig(filters)).toEqual(expectedResult);
  });
});
