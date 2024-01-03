import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import ConfirmItemArrival from './ConfirmItemArrival';

const testIds = {
  confirmItemArrivalPaneSet: 'confirmItemArrivalPaneSet',
  confirmItemArrivalPane: 'confirmItemArrivalPane',
};
const labelIds = {
  paneTitle: 'ui-requests-mediated.app.confirmItemArrival.paneTitle',
};

describe('ConfirmItemArrival', () => {
  beforeEach(() => {
    render(<ConfirmItemArrival />);
  });

  it('should render pane set', () => {
    expect(screen.getByTestId(testIds.confirmItemArrivalPaneSet)).toBeInTheDocument();
  });

  it('should render pane', () => {
    expect(screen.getByTestId(testIds.confirmItemArrivalPane)).toBeInTheDocument();
  });

  it('should render pane title', () => {
    expect(screen.getByText(labelIds.paneTitle)).toBeVisible();
  });
});
