import React from 'react';

import {
  render,
  screen,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequests from './MediatedRequests';

const testIds = {
  mediatedRequestsPaneSet: 'mediatedRequestsPaneSet',
  mediatedRequestsPane: 'mediatedRequestsPane',
};
const labelIds = {
  paneTitle: 'ui-requests-mediated.app.index.paneTitle',
};

describe('MediatedRequests', () => {
  beforeEach(() => {
    render(<MediatedRequests />);
  });

  afterEach(cleanup);

  it('should render pane set', () => {
    expect(screen.getByTestId(testIds.mediatedRequestsPaneSet)).toBeInTheDocument();
  });

  it('should render pane', () => {
    expect(screen.getByTestId(testIds.mediatedRequestsPane)).toBeInTheDocument();
  });

  it('should render pane title', () => {
    expect(screen.getByText(labelIds.paneTitle)).toBeVisible();
  });
});
