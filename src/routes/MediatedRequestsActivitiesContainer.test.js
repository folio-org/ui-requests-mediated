import {
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestsActivitiesContainer, {
  buildQuery,
} from './MediatedRequestsActivitiesContainer';
import MediatedRequestsActivities from '../components/MediatedRequestsActivities';

import {
  MEDIATED_REQUESTS_RECORDS_NAME,
} from '../constants';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
}));

jest.mock('../components/MediatedRequestsActivities', () => jest.fn((props) => (<div {...props} />)));

const logger = {
  log: jest.fn(),
};
const queryParams = {
  query: 'queryValue',
  sort: 'sortValue',
};
const resources = {
  query: queryParams,
};

describe('MediatedRequestsActivitiesContainer', () => {
  const mutator = {
    [MEDIATED_REQUESTS_RECORDS_NAME]: {
      POST: jest.fn(),
    },
    query: {
      update: jest.fn(),
      replace: jest.fn(),
    },
    resultOffset: {
      replace: jest.fn(),
    },
  };
  const props = {
    location: {
      state: {
        search: '',
        pathname: '',
      },
    },
    stripes: {
      logger,
    },
    resources,
    mutator,
  };
  beforeEach(() => {
    render(<MediatedRequestsActivitiesContainer {...props} />);
  });

  it('should render mediated requests activities with correct props', () => {
    expect(MediatedRequestsActivities).toHaveBeenCalledWith(expect.objectContaining({
      resources,
      mutator,
    }), {});
  });
});

describe('buildQuery', () => {
  const pathComponents = {};

  it('should return empty CQL query', () => {
    expect(buildQuery({}, pathComponents, { query: {} }, logger)).toBeFalsy();
  });

  it('should include search fields when building CQL query', () => {
    expect(buildQuery(queryParams, pathComponents, resources, logger)).toEqual(expect.stringContaining(
      'instance.title=="*queryValue*" or item.barcode=="*queryValue*" or requester.barcode=="*queryValue*" or searchIndex.callNumberComponents.callNumber=="*queryValue*" or fullCallNumberIndex=="*queryValue*") sortby sortValue'
    ));
  });
});
