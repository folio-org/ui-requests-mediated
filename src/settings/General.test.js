import React from 'react';

import {
  render,
  screen,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';

import General from './General';

const testIds = {
  generalPane: 'generalPane',
};
const labelIds = {
  generalMessage: 'ui-requests-mediated.settings.general.message',
};

describe('General', () => {
  const label = 'label for General';
  const props = {
    label,
  };
  beforeEach(() => {
    render(<General {...props} />);
  });

  afterEach(cleanup);

  it('should render pane', () => {
    expect(screen.getByTestId(testIds.generalPane)).toBeInTheDocument();
  });

  it('should render label', () => {
    expect(screen.getByText(label)).toBeVisible();
  });

  it('should render general message', () => {
    expect(screen.getByText(labelIds.generalMessage)).toBeVisible();
  });
});
