import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import MediatedRequestsActivitiesContainer, {
  buildQuery,
} from './MediatedRequestsActivitiesContainer';
import MediatedRequestsActivities from '../components/MediatedRequestsActivities';

import {
  PAGE_AMOUNT,
  MEDIATED_REQUESTS_RECORDS_NAME,
} from '../constants';

const testIds = {
  onNeedMoreData: 'onNeedMoreData',
};
const mockFetchMore = jest.fn();
const mockFetchOffset = jest.fn();

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  StripesConnectedSource: jest.fn().mockImplementation(() => ({
    fetchMore: mockFetchMore,
    fetchOffset: mockFetchOffset,
  })),
}));

jest.mock('../components/MediatedRequestsActivities', () => jest.fn((props) => (
  <div {...props}>
    <button
      type="button"
      data-testid={testIds.onNeedMoreData}
      onClick={props.onNeedMoreData}
    >
      onNeedMoreData
    </button>
  </div>
)));

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
const settings = {};
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
  settings,
};

describe('MediatedRequestsActivitiesContainer', () => {
  beforeEach(() => {
    render(<MediatedRequestsActivitiesContainer {...props} />);
  });

  it('should render mediated requests activities with correct props', () => {
    expect(MediatedRequestsActivities).toHaveBeenCalledWith(expect.objectContaining({
      onNeedMoreData: expect.any(Function),
      resources,
      mutator,
      settings,
    }), {});
  });
});

describe('onNeedMoreData', () => {
  beforeEach(() => {
    render(<MediatedRequestsActivitiesContainer {...props} />);
  });

  it('should trigger onNeedMoreData', async () => {
    await userEvent.click(screen.getByText('onNeedMoreData'));

    expect(mockFetchMore).toHaveBeenCalledWith(PAGE_AMOUNT);
  });
});

describe('buildQuery', () => {
  const pathComponents = {};

  it('should return empty CQL query', () => {
    expect(buildQuery({}, pathComponents, { query: {} }, logger)).toBeFalsy();
  });

  it('should include search fields when building CQL query', () => {
    expect(buildQuery(queryParams, pathComponents, resources, logger)).toEqual(expect.stringContaining(
      'instanceTitle=="queryValue*" or itemBarcode=="queryValue*" or requesterBarcode=="queryValue*" or callNumber=="queryValue*" or fullCallNumber=="queryValue*") sortby sortValue'
    ));
  });
});
