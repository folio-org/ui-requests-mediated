import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import DeclineModal from './DeclineModal';

const testIds = {
  confirmButton: 'confirmButton',
  backButton: 'backButton',
};
const messageIds = {
  title: 'ui-requests-mediated.declineModal.title',
  message: 'ui-requests-mediated.declineModal.message',
  confirmButton: 'ui-requests-mediated.declineModal.confirm',
  backButton: 'ui-requests-mediated.declineModal.back',
};
const defaultProps = {
  open: true,
  title: 'Title',
  onConfirm: jest.fn(),
  onClose: jest.fn(),
};

describe('DeclineModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    render(
      <DeclineModal {...defaultProps} />
    );
  });

  it('should render title', () => {
    expect(screen.getByText(messageIds.title)).toBeVisible();
  });

  it('should render message', () => {
    expect(screen.getByText(messageIds.message)).toBeVisible();
  });

  describe('Confirm button', () => {
    it('should render confirm button', () => {
      expect(screen.getByTestId(testIds.confirmButton)).toBeVisible();
    });

    it('should render confirm button text', () => {
      expect(screen.getByText(messageIds.confirmButton)).toBeVisible();
    });

    it('should call onConfirm', () => {
      fireEvent.click(screen.getByTestId(testIds.confirmButton));

      expect(defaultProps.onConfirm).toHaveBeenCalled();
    });
  });

  describe('Back button', () => {
    it('should render back button', () => {
      expect(screen.getByTestId(testIds.backButton)).toBeVisible();
    });

    it('should render back button text', () => {
      expect(screen.getByText(messageIds.backButton)).toBeVisible();
    });

    it('should call onClose', () => {
      fireEvent.click(screen.getByTestId(testIds.backButton));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
