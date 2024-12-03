import {
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import ConfirmItemArrival from './ConfirmItemArrival';
import ConfirmItem from '../ConfirmItem';
import ErrorModal from '../ErrorModal';

import {
  CONFIRM_ITEM_TYPES,
  getConfirmItemArrivalUrl,
} from '../../constants';

jest.mock('../ConfirmItem', () => jest.fn((props) => (<div {...props} />)));
jest.mock('../ErrorModal', () => jest.fn((props) => (<div {...props} />)));

const messageIds = {
  paneTitle: 'ui-requests-mediated.confirmItemArrival.paneTitle',
  title: 'ui-requests-mediated.confirmItem.errorModal.confirmItemArrival.title',
  message: 'ui-requests-mediated.confirmItem.errorModal.confirmItemArrival.message',
};

describe('ConfirmItemArrival', () => {
  beforeEach(() => {
    render(<ConfirmItemArrival />);
  });

  it('should render ConfirmItem with correct props', () => {
    expect(ConfirmItem).toHaveBeenCalledWith(expect.objectContaining({
      paneTitle: messageIds.paneTitle,
      navigationMenuUrl: getConfirmItemArrivalUrl(),
      confirmItemType: CONFIRM_ITEM_TYPES.CONFIRM_ITEM_ARRIVAL,
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
});
