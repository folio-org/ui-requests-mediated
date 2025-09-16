import {
  MemoryRouter,
  useHistory,
} from 'react-router-dom';

import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  exportToCsv,
  filters2cql,
} from '@folio/stripes/components';

import MediatedRequestsActivities, {
  getActionMenu,
  getResultPaneSub,
} from './MediatedRequestsActivities';
import NavigationMenu from '../NavigationMenu';
import MediatedRequestsFilters from './components/MediatedRequestsFilters';
import {
  getMediatedRequestsActivitiesUrl,
  MODULE_ROUTE,
  MEDIATED_REQUESTS_ACTIVITIES,
  FILTER_CONFIG, SEARCH_FIELDS,
  MEDIATED_REQUEST_SEARCH_PARAMS,
} from '../../constants';

jest.mock('../NavigationMenu', () => jest.fn((props) => (<div {...props} />)));
jest.mock('./components/MediatedRequestsFilters', () => jest.fn((props) => (<div {...props} />)));

const testIds = {
  mediatedRequestsActivitiesSearchAndSortQuery: 'mediatedRequestsActivitiesSearchAndSortQuery',
  mediatedRequestsActivitiesPaneSet: 'mediatedRequestsActivitiesPaneSet',
  mediatedRequestsActivitiesPane: 'mediatedRequestsActivitiesPane',
};
const labelIds = {
  paneTitle: 'ui-requests-mediated.mediatedRequestsActivities.paneTitle',
  newMediatedRequestButton: 'ui-requests-mediated.mediatedRequestList.actionMenu.newMediatedRequest',
  exportToSCVButton: 'ui-requests-mediated.mediatedRequestList.actionMenu.exportResults',
  reportPendingButton: 'ui-requests-mediated.mediatedRequestList.actionMenu.reportPending',
  searchCriteria: 'stripes-smart-components.searchCriteria',
  searchResultsCount: 'stripes-smart-components.searchResultsCountHeader',
};

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  SearchAndSortQuery:  jest.fn(({
    children,
    'data-testid': testId,
  }) => (
    <div data-testid={testId}>
      {children({
        getFilterHandlers: () => {}
      })}
    </div>
  )),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useHistory: jest.fn(),
}));
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  modifyRecordsToExport: jest.fn(records => records),
}));

describe('MediatedRequestsActivities', () => {
  const mutator = {
    resultOffset: {
      replace: jest.fn(),
      update: jest.fn(),
    },
  };
  const querySetter = jest.fn();
  const queryGetter = jest.fn(() => ({}));
  const resources = {
    query: {},
    resultCount: 100,
    resultOffset: 0,
  };
  const source = {
    resources,
    loaded: jest.fn(),
    totalCount: jest.fn(),
  };
  const settings = {};
  const basicProps = {
    querySetter,
    queryGetter,
    source,
    resources,
    mutator,
    settings,
  };

  describe('When search term is entered', () => {
    beforeEach(() => {
      useHistory.mockReturnValueOnce({ push: jest.fn() });

      render(
        <MemoryRouter>
          <MediatedRequestsActivities
            {...basicProps}
          />
        </MemoryRouter>
      );
    });

    it('should render search and sort query', () => {
      expect(screen.getByTestId(testIds.mediatedRequestsActivitiesSearchAndSortQuery)).toBeInTheDocument();
    });

    it('should render pane set', () => {
      expect(screen.getByTestId(testIds.mediatedRequestsActivitiesPaneSet)).toBeInTheDocument();
    });

    it('should render pane', () => {
      expect(screen.getByTestId(testIds.mediatedRequestsActivitiesPane)).toBeInTheDocument();
    });

    it('should render pane title', () => {
      expect(screen.getByText(labelIds.paneTitle)).toBeVisible();
    });

    it('should trigger navigation menu with correct props', () => {
      expect(NavigationMenu).toHaveBeenCalledWith(expect.objectContaining({
        value: getMediatedRequestsActivitiesUrl(),
      }), {});
    });

    it('should trigger mediated requests filters with correct props', () => {
      expect(MediatedRequestsFilters).toHaveBeenCalledWith(expect.objectContaining({
        settings,
      }), {});
    });
  });
});

describe('getActionMenu', () => {
  const onToggle = jest.fn();
  const mediatedRequests = [
    {
      id: 'id_1',
      instance: {
        title: 'title_1',
        contributorNames: [{ name: 'contributor' }],
      },
      requester: {
        lastName: 'requesterLastName_1',
        barcode: 'requesterBarcode_1',
      },
    },
    {
      id: 'id_2',
      instance: {
        title: 'title_2',
      },
      requester: {
        lastName: 'requesterLastName_2',
        barcode: 'requesterBarcode_2',
      },
    }
  ];
  const actionData = {
    renderColumnsMenu: 'renderColumnsMenu',
    mediatedRequests,
    searchValue: {
      query: 'searchQuery',
    },
    activeFilters: {
      string: 'requestLevel.Title',
    },
    reportRecords: {
      GET: jest.fn(),
      reset: jest.fn(),
    },
    callout: {
      sendCallout: jest.fn(),
    },
    history: {
      push: jest.fn(),
    },
    isLoadingReport: false,
    setIsLoadingReport: jest.fn(),
    formatMessage: jest.fn(({ id }) => id),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Action menu', () => {
    beforeEach(() => {
      render(getActionMenu(actionData)({ onToggle }));
    });

    it('should render new mediated request button', () => {
      expect(screen.getByText(labelIds.newMediatedRequestButton)).toBeInTheDocument();
    });

    it('should render columns menu', async () => {
      expect(await screen.findByText(actionData.renderColumnsMenu)).toBeInTheDocument();
    });

    it('should redirect to new mediated request form', () => {
      const newMediatedRequestButton = screen.getByText(labelIds.newMediatedRequestButton);

      fireEvent.click(newMediatedRequestButton);

      expect(actionData.history.push).toHaveBeenCalledWith(`/${MODULE_ROUTE}/${MEDIATED_REQUESTS_ACTIVITIES}/create`);
    });

    it('should render export to CSV button', () => {
      expect(screen.getByText(labelIds.exportToSCVButton)).toBeInTheDocument();
    });
  });

  describe('Export to CSV action', () => {
    describe('When data to export received successfully', () => {
      const dataToReport = [...mediatedRequests];

      beforeEach(() => {
        filters2cql.mockImplementationOnce((config, filters) => filters);
        actionData.reportRecords.GET.mockResolvedValueOnce(dataToReport);
        render(getActionMenu(actionData)({ onToggle }));

        const exportToCSVButton = screen.getByText(labelIds.exportToSCVButton);

        fireEvent.click(exportToCSVButton);
      });

      it('should toggle action menu after clicking on export button', () => {
        expect(onToggle).toHaveBeenCalled();
      });

      it('should send callout', () => {
        expect(actionData.callout.sendCallout).toHaveBeenCalled();
      });

      it('should transform filter params', () => {
        expect(filters2cql).toHaveBeenCalledWith(FILTER_CONFIG, actionData.activeFilters.string);
      });

      it('should export data to CSV', () => {
        expect(exportToCsv).toHaveBeenCalledWith(mediatedRequests, {
          onlyFields: expect.any(Array),
        });
      });
    });

    describe('When only search query is provided', () => {
      const actionMenuData = {
        ...actionData,
        activeFilters: {},
      };

      beforeEach(() => {
        filters2cql.mockImplementationOnce((config, filters) => filters);
        render(getActionMenu(actionMenuData)({ onToggle }));

        const exportToCSVButton = screen.getByText(labelIds.exportToSCVButton);

        fireEvent.click(exportToCSVButton);
      });

      it('should get data to report with correct query', () => {
        const query = SEARCH_FIELDS.map(searchSubQuery => (searchSubQuery === MEDIATED_REQUEST_SEARCH_PARAMS.ID ? `${searchSubQuery}==${actionMenuData.searchValue.query}` : `${searchSubQuery}==${actionMenuData.searchValue.query}*`)).join(' or ');

        expect(actionMenuData.reportRecords.GET).toHaveBeenCalledWith({
          params: {
            query: `(${query})`,
            limit: 1000,
            offset: 0,
          },
        });
      });
    });

    describe('When only filter query is provided', () => {
      const actionMenuData = {
        ...actionData,
        searchValue: {},
      };

      beforeEach(() => {
        filters2cql.mockImplementationOnce((config, filters) => filters);
        render(getActionMenu(actionMenuData)({ onToggle }));

        const exportToCSVButton = screen.getByText(labelIds.exportToSCVButton);

        fireEvent.click(exportToCSVButton);
      });

      it('should get data to report with correct query', () => {
        expect(actionMenuData.reportRecords.GET).toHaveBeenCalledWith({
          params: {
            query: actionMenuData.activeFilters.string,
            limit: 1000,
            offset: 0,
          },
        });
      });
    });

    describe('When report is loading', () => {
      beforeEach(() => {
        const actionMenuData = {
          ...actionData,
          isLoadingReport: true,
        };

        render(getActionMenu(actionMenuData)({ onToggle }));
      });

      it('should render report pending button', () => {
        const reportPendingButton = screen.getByText(labelIds.reportPendingButton);

        expect(reportPendingButton).toBeInTheDocument();
      });

      it('should hide export results button', () => {
        const exportToSCVButton = screen.queryByText(labelIds.exportToSCVButton);

        expect(exportToSCVButton).not.toBeInTheDocument();
      });
    });
  });
});

describe('getResultPaneSub', () => {
  it('should render search criteria', () => {
    const source = {
      loaded: jest.fn(() => false),
    };

    render(getResultPaneSub(source));

    expect(screen.getByText(labelIds.searchCriteria)).toBeInTheDocument();
  });

  it('should render search results count', () => {
    const source = {
      totalCount: jest.fn(),
      loaded: jest.fn(() => true),
    };

    render(getResultPaneSub(source));

    expect(screen.getByText(labelIds.searchResultsCount)).toBeInTheDocument();
  });
});
