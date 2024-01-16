import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import SendItemInTransit from './SendItemInTransit';
import NavigationMenu from '../NavigationMenu';

import { getSendItemInTransitUrl } from '../../constants';

jest.mock('../NavigationMenu', () => jest.fn((props) => (<div {...props} />)));

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

  it('should trigger NavigationMenu with correct props', () => {
    expect(NavigationMenu).toHaveBeenCalledWith(expect.objectContaining({
      value: getSendItemInTransitUrl(),
    }), {});
  });
});
