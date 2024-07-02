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
  const props = {
    settings: {},
  };

  beforeEach(() => {
    render(<MediatedRequestsActivities {...props} />);
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

  it('should trigger NavigationMenu with correct props', () => {
    expect(NavigationMenu).toHaveBeenCalledWith(expect.objectContaining({
      value: getMediatedRequestsActivitiesUrl(),
    }), {});
  });

  it('should trigger MediatedRequestsFilters with correct props', () => {
    expect(MediatedRequestsFilters).toHaveBeenCalledWith(expect.objectContaining({
      settings: props.settings,
    }), {});
  });

  it('should render CollapseFilterPaneButton', () => {
    expect(screen.getByTestId(testIds.mediatedRequestsActivitiesCollapseFilterPaneButton)).toBeInTheDocument();
  });
});
