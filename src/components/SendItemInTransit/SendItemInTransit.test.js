import {
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import SendItemInTransit from './SendItemInTransit';
import ConfirmItem from '../ConfirmItem';
import ErrorModal from '../ErrorModal';

import {
  CONFIRM_ITEM_TYPES,
  getSendItemInTransitUrl,
} from '../../constants';

jest.mock('../ConfirmItem', () => jest.fn((props) => (<div {...props} />)));
jest.mock('../ErrorModal', () => jest.fn((props) => (<div {...props} />)));

const messageIds = {
  paneTitle: 'ui-requests-mediated.sendItemInTransit.paneTitle',
  title: 'ui-requests-mediated.confirmItem.errorModal.sendItemInTransit.title',
  message: 'ui-requests-mediated.confirmItem.errorModal.sendItemInTransit.message',
};

describe('SendItemInTransit', () => {
  beforeEach(() => {
    render(<SendItemInTransit />);
  });

  it('should render ConfirmItem with correct props', () => {
    expect(ConfirmItem).toHaveBeenCalledWith(expect.objectContaining({
      paneTitle: messageIds.paneTitle,
      navigationMenuFunction: getSendItemInTransitUrl(),
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
});
