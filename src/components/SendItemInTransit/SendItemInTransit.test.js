import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import SendItemInTransit, {
  PRINT_BUTTON_SELECTOR,
} from './SendItemInTransit';
import ConfirmItem from '../ConfirmItem';
import ErrorModal from '../ErrorModal';
import { handleConfirmItemSubmit } from '../../utils';

import {
  CONFIRM_ITEM_TYPES,
  getSendItemInTransitUrl,
} from '../../constants';

const testIds = {
  confirmItemForm: 'confirmItemForm',
  closeModalButton: 'closeModalButton',
};

jest.mock('../../hooks', () => ({
  useStaffSlipsTemplate: jest.fn(() => ({
    staffSlips: [],
  })),
}));
jest.mock('../../utils', () => ({
  getStaffSlipsTemplateByType: jest.fn(() => ''),
  handleConfirmItemSubmit: jest.fn((itemBarcode, confirmItemState, confirmItemProps) => {
    confirmItemProps.onSuccess();
  }),
}));
jest.mock('../ConfirmItem', () => jest.fn(({
  onSubmit,
}) => {
  return <form
    data-testid={testIds.confirmItemForm}
    onSubmit={onSubmit}
  />;
}));
jest.mock('../ErrorModal', () => jest.fn(({
  onClose,
}) => {
  return (
    <button
      type="button"
      data-testid={testIds.closeModalButton}
      onClick={onClose}
    >
      Close
    </button>
  );
}));
jest.mock('react-to-print', () => jest.fn(({
  content,
  trigger,
  onAfterPrint,
}) => {
  onAfterPrint();
  content();

  return (
    <div>
      {trigger()}
    </div>
  );
}));

const messageIds = {
  paneTitle: 'ui-requests-mediated.sendItemInTransit.paneTitle',
  title: 'ui-requests-mediated.confirmItem.errorModal.sendItemInTransit.title',
  message: 'ui-requests-mediated.confirmItem.errorModal.sendItemInTransit.message',
};

describe('SendItemInTransit', () => {
  beforeEach(() => {
    render(<SendItemInTransit />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ConfirmItem with correct props', () => {
    expect(ConfirmItem).toHaveBeenCalledWith(expect.objectContaining({
      paneTitle: messageIds.paneTitle,
      navigationMenuUrl: getSendItemInTransitUrl(),
      confirmItemType: CONFIRM_ITEM_TYPES.SEND_ITEM_IN_TRANSIT,
      contentData: [],
      onSubmit: expect.any(Function),
    }), {});
  });

  it('should render ErrorModal with correct props', () => {
    expect(ErrorModal).toHaveBeenCalledWith(expect.objectContaining({
      title: messageIds.title,
      message: messageIds.message,
      open: false,
      onClose: expect.any(Function),
    }), {});
  });

  it('should handle data submitting', () => {
    const confirmItemForm = screen.getByTestId(testIds.confirmItemForm);

    fireEvent.submit(confirmItemForm);

    expect(handleConfirmItemSubmit).toHaveBeenCalled();
  });

  it('should render print button', () => {
    const printButton = screen.getByText(PRINT_BUTTON_SELECTOR);

    expect(printButton).toBeInTheDocument();
  });

  it('should close error modal', () => {
    const confirmItemForm = screen.getByTestId(testIds.confirmItemForm);

    handleConfirmItemSubmit.mockImplementationOnce((itemBarcode, confirmItemState) => {
      confirmItemState.setIsErrorModalOpen(true);
    });
    fireEvent.submit(confirmItemForm);

    const closeModalButton = screen.getByTestId(testIds.closeModalButton);

    fireEvent.click(closeModalButton);

    expect(ErrorModal).toHaveBeenCalledWith(expect.objectContaining({
      open: false,
    }), {});
  });
});
