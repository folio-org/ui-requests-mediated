import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestsActivities from './MediatedRequestsActivities';
import NavigationMenu from '../NavigationMenu';
import MediatedRequestsFilters from './components/MediatedRequestsFilters';

import { getMediatedRequestsActivitiesUrl } from '../../constants';

jest.mock('../NavigationMenu', () => jest.fn((props) => (<div {...props} />)));
jest.mock('./components/MediatedRequestsFilters', () => jest.fn((props) => (<div {...props} />)));

const testIds = {
  mediatedRequestsActivitiesSearchAndSortQuery: 'mediatedRequestsActivitiesSearchAndSortQuery',
  mediatedRequestsActivitiesPaneSet: 'mediatedRequestsActivitiesPaneSet',
  mediatedRequestsActivitiesPane: 'mediatedRequestsActivitiesPane',
  mediatedRequestsActivitiesCollapseFilterPaneButton: 'mediatedRequestsActivitiesCollapseFilterPaneButton',
};
const labelIds = {
  paneTitle: 'ui-requests-mediated.app.mediatedRequestsActivities.paneTitle',
};

describe('MediatedRequestsActivities', () => {
  const mutator = {
    resultOffset: {
      replace: jest.fn(),
    },
  };
  const querySetter = jest.fn();
  const queryGetter = jest.fn(() => {});
  const source = [];
  const resources = [];
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

  it('should render navigation menu with correct props', () => {
    expect(NavigationMenu).toHaveBeenCalledWith(expect.objectContaining({
      value: getMediatedRequestsActivitiesUrl(),
    }), {});
  });

  it('should render mediated requests filters with correct props', () => {
    expect(MediatedRequestsFilters).toHaveBeenCalledWith(expect.objectContaining({
      settings,
    }), {});
  });

  it('should render collapse filter pane button', () => {
    expect(screen.getByTestId(testIds.mediatedRequestsActivitiesCollapseFilterPaneButton)).toBeInTheDocument();
  });
});
