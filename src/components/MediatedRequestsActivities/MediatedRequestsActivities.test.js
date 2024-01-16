import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestsActivities from './MediatedRequestsActivities';
import NavigationMenu from '../NavigationMenu';

import { getMediatedRequestsActivitiesUrl } from '../../constants';

jest.mock('../NavigationMenu', () => jest.fn((props) => (<div {...props} />)));

const testIds = {
  mediatedRequestsActivitiesPaneSet: 'mediatedRequestsActivitiesPaneSet',
  mediatedRequestsActivitiesPane: 'mediatedRequestsActivitiesPane',
};
const labelIds = {
  paneTitle: 'ui-requests-mediated.app.mediatedRequestsActivities.paneTitle',
};

describe('MediatedRequestsActivities', () => {
  beforeEach(() => {
    render(<MediatedRequestsActivities />);
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
});
