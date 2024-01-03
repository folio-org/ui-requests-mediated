import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import SendItemInTransit from './SendItemInTransit';

const testIds = {
  sendItemInTransitPaneSet: 'sendItemInTransitPaneSet',
  sendItemInTransitPane: 'sendItemInTransitPane',
};
const labelIds = {
  paneTitle: 'ui-requests-mediated.app.sendItemInTransit.paneTitle',
};

describe('SendItemInTransit', () => {
  beforeEach(() => {
    render(<SendItemInTransit />);
  });

  it('should render pane set', () => {
    expect(screen.getByTestId(testIds.sendItemInTransitPaneSet)).toBeInTheDocument();
  });

  it('should render pane', () => {
    expect(screen.getByTestId(testIds.sendItemInTransitPane)).toBeInTheDocument();
  });

  it('should render pane title', () => {
    expect(screen.getByText(labelIds.paneTitle)).toBeVisible();
  });
});
