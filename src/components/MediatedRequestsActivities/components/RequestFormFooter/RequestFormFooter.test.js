import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import RequestFormFooter from './RequestFormFooter';

const basicProps = {
  onCancel: jest.fn(),
  isSaveAndCloseButtonDisabled: false,
  isConfirmButtonDisabled: false,
};
const labelIds = {
  cancelButton: 'ui-requests-mediated.form.cancelButton',
  saveAndCloseButton: 'stripes-components.saveAndClose',
  confirmButton: 'ui-requests-mediated.form.confirmButton',
};

describe('RequestFormFooter', () => {
  beforeEach(() => {
    render(
      <RequestFormFooter
        {...basicProps}
      />
    );
  });

  it('should render cancel button', () => {
    const cancelButton = screen.getByText(labelIds.cancelButton);

    expect(cancelButton).toBeInTheDocument();
  });

  it('should render save and close button', () => {
    const saveAndCloseButton = screen.getByText(labelIds.saveAndCloseButton);

    expect(saveAndCloseButton).toBeInTheDocument();
  });

  it('should render confirm button', () => {
    const confirmButton = screen.getByText(labelIds.confirmButton);

    expect(confirmButton).toBeInTheDocument();
  });

  it('should handle cancel', () => {
    const cancelButton = screen.getByText(labelIds.cancelButton);

    fireEvent.click(cancelButton);

    expect(basicProps.onCancel).toHaveBeenCalled();
  });
});
