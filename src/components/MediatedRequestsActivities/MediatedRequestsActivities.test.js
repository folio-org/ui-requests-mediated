import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestsActivities, {
  getActionMenu,
} from './MediatedRequestsActivities';
import NavigationMenu from '../NavigationMenu';
import MediatedRequestsFilters from './components/MediatedRequestsFilters';

import { getMediatedRequestsActivitiesUrl } from '../../constants';

jest.mock('../NavigationMenu', () => jest.fn((props) => (<div {...props} />)));
jest.mock('./components/MediatedRequestsFilters', () => jest.fn((props) => (<div {...props} />)));

const testIds = {
  mediatedRequestsActivitiesSearchAndSortQuery: 'mediatedRequestsActivitiesSearchAndSortQuery',
  mediatedRequestsActivitiesPaneSet: 'mediatedRequestsActivitiesPaneSet',
  mediatedRequestsActivitiesPane: 'mediatedRequestsActivitiesPane',
};
const labelIds = {
  paneTitle: 'ui-requests-mediated.app.mediatedRequestsActivities.paneTitle',
  newMediatedRequestButton: 'ui-requests-mediated.mediatedRequestList.actionMenu.newMediatedRequest',
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
  };
  const settings = {};

  beforeEach(() => {
    render(
      <MediatedRequestsActivities
        querySetter={querySetter}
        queryGetter={queryGetter}
        source={source}
        resources={resources}
        mutator={mutator}
        settings={settings}
      />
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
describe('getActionMenu', () => {
  const renderColumnsMenu = 'renderColumnsMenu';

  beforeEach(() => {
    render(getActionMenu(renderColumnsMenu)());
  });

  it('should render new mediated request button', () => {
    expect(screen.getByText(labelIds.newMediatedRequestButton)).toBeInTheDocument();
  });

  it('should render columns menu', async () => {
    expect(await screen.findByText(renderColumnsMenu)).toBeInTheDocument();
  });
});
