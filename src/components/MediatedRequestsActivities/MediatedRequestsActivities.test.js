import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestsActivities from './MediatedRequestsActivities';

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
});
