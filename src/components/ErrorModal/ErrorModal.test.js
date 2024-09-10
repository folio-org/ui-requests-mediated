import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import ErrorModal from './ErrorModal';

const testIds = {
  closeButton: 'closeButton',
};
const messageIds = {
  title: 'ui-tenant-settings.title',
  message: 'ui-tenant-settings.message',
  closeButton: 'ui-requests-mediated.confirmItem.errorModal.close',
};
const defaultProps = {
  title: messageIds.title,
  message: messageIds.message,
  open: true,
  onClose: jest.fn(),
};

describe('ErrorModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    render(
      <ErrorModal {...defaultProps} />
    );
  });

  it('should render title', () => {
    expect(screen.getByText(messageIds.title)).toBeVisible();
  });

  it('should render message', () => {
    expect(screen.getByText(messageIds.message)).toBeVisible();
  });

  describe('Close button', () => {
    it('should render close button', () => {
      expect(screen.getByTestId(testIds.closeButton)).toBeVisible();
    });

    it('should render close button text', () => {
      expect(screen.getByText(messageIds.closeButton)).toBeVisible();
    });

    it('should call onClose', () => {
      fireEvent.click(screen.getByTestId(testIds.closeButton));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
