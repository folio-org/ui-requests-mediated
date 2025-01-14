import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import MediatedRequestsActivitiesContainer, {
  buildQuery,
  updateMediatedRequestList,
} from './MediatedRequestsActivitiesContainer';
import MediatedRequestsActivities from '../components/MediatedRequestsActivities';

import {
  PAGE_AMOUNT,
  MEDIATED_REQUESTS_RECORDS_NAME,
  MEDIATED_REQUEST_STATUS,
} from '../constants';

const testIds = {
  onNeedMoreData: 'onNeedMoreData',
};
const mockFetchMore = jest.fn();
const mockFetchOffset = jest.fn();
const mockUpdate = jest.fn();

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  StripesConnectedSource: jest.fn().mockImplementation(() => ({
    fetchMore: mockFetchMore,
    fetchOffset: mockFetchOffset,
    update: mockUpdate,
  })),
}));

jest.mock('../components/MediatedRequestsActivities', () => jest.fn((props) => {
  props.queryGetter();

  return (
    <div {...props}>
      <button
        type="button"
        data-testid={testIds.onNeedMoreData}
        onClick={props.onNeedMoreData}
      >
        onNeedMoreData
      </button>
    </div>
  );
}));

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
  history: {
    push: jest.fn(),
  },
  stripes: {
    logger,
  },
  resources,
  mutator,
  settings,
  children: <div />,
};

describe('MediatedRequestsActivitiesContainer', () => {
  describe('Initial render', () => {
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

    it('should trigger onNeedMoreData', async () => {
      await userEvent.click(screen.getByText('onNeedMoreData'));

      expect(mockFetchMore).toHaveBeenCalledWith(PAGE_AMOUNT);
    });
  });

  describe('Component updating', () => {
    beforeEach(() => {
      const { rerender } = render(<MediatedRequestsActivitiesContainer {...props} />);
      const newProps = {
        ...props,
        location: {
          state: {
            search: 'test',
            pathname: '',
          },
        },
      };

      rerender(<MediatedRequestsActivitiesContainer {...newProps} />);
    });

    it('should update source', () => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('querySetter', () => {
    describe('When query data is provided', () => {
      const queryData = {
        nsValues: {
          query: 'query*',
        },
        state: {
          sortChanged: true,
          changeType: 'reset',
          filterFields: {},
        },
      };

      beforeEach(() => {
        MediatedRequestsActivities.mockImplementationOnce(({ querySetter }) => {
          querySetter(queryData);
        });

        render(<MediatedRequestsActivitiesContainer {...props} />);
      });

      it('should trigger "resultOffset.replace"', () => {
        expect(props.mutator.resultOffset.replace).toHaveBeenCalledWith(0);
      });

      it('should replace query params', () => {
        expect(props.mutator.query.replace).toHaveBeenCalledWith(queryData.nsValues);
      });

      it('should redirect to new page', () => {
        expect(props.history.push).toHaveBeenCalled();
      });
    });

    describe('When query data is not provided', () => {
      const queryData = {
        nsValues: {
          query: '',
        },
        state: {
          sortChanged: false,
          changeType: '',
          filterFields: {
            status: [MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION],
          },
        },
      };

      beforeEach(() => {
        MediatedRequestsActivities.mockImplementationOnce(({ querySetter }) => {
          querySetter(queryData);
        });

        render(<MediatedRequestsActivitiesContainer {...props} />);
      });

      it('should update query params', () => {
        expect(props.mutator.query.update).toHaveBeenCalledWith(queryData.nsValues);
      });
    });
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

describe('updateMediatedRequestList', () => {
  const source = {
    resources: {
      query: ['query=Test'],
    },
  };

  it('should trigger history push', () => {
    updateMediatedRequestList(source, props);

    expect(props.history.push).toHaveBeenCalledWith(expect.stringContaining(
      'query%3DTest'
    ));
  });
});
