import {
  render,
  screen,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestsActions from './MediatedRequestsActions';

const testIds = {
  mediatedRequestsActionsPaneSet: 'mediatedRequestsActionsPaneSet',
  mediatedRequestsActionPane: 'mediatedRequestsActionPane',
};
const labelIds = {
  paneTitle: 'ui-requests-mediated.app.mediatedRequestsActions.paneTitle',
};

describe('MediatedRequests', () => {
  beforeEach(() => {
    render(<MediatedRequestsActions />);
  });

  afterEach(cleanup);

  it('should render pane set', () => {
    expect(screen.getByTestId(testIds.mediatedRequestsActionsPaneSet)).toBeInTheDocument();
  });

  it('should render pane', () => {
    expect(screen.getByTestId(testIds.mediatedRequestsActionPane)).toBeInTheDocument();
  });

  it('should render pane title', () => {
    expect(screen.getByText(labelIds.paneTitle)).toBeVisible();
  });
});
