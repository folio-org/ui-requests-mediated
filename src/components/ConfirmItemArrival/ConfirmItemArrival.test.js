import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import ConfirmItemArrival from './ConfirmItemArrival';
import NavigationMenu from '../NavigationMenu';

import { getConfirmItemArrivalUrl } from '../../constants';

jest.mock('../NavigationMenu', () => jest.fn((props) => (<div {...props} />)));

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

  it('should trigger NavigationMenu with correct props', () => {
    expect(NavigationMenu).toHaveBeenCalledWith(expect.objectContaining({
      value: getConfirmItemArrivalUrl(),
    }), {});
  });
});
