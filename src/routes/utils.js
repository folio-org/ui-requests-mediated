import {
  parseFilters,
} from '@folio/stripes/smart-components';

export const buildFilterConfig = (filters) => {
  const customFilterConfig = [];
  const parsedFilters = parseFilters(filters);

  Object.keys(parsedFilters).forEach(name => {
    if (/customFields/.exec(name)) {
      customFilterConfig.push(
        {
          name,
          cql: name.split('-').join('.'),
          values: [],
          operator: '=',
        },
      );
    }
  });

  return customFilterConfig;
};
