import {
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import {
  useOkapiKy,
} from '@folio/stripes/core';

import ConfirmItem from '../ConfirmItem';
import ErrorModal from '../ErrorModal';

import {
  CONFIRM_ITEM_TYPES,
  getSendItemInTransitUrl,
} from '../../constants';
import {
  handleConfirmItemSubmit,
} from '../../utils';

const SEND_ITEM_IN_TRANSIT_URL = 'requests-mediated/send-item-in-transit';

const SendItemInTransit = () => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [sendItemInTransitData, setSendItemInTransitData] = useState([]);
  const [sendItemInTransitErrorModalOpen, setSendItemInTransitErrorModalOpen] = useState(false);
  const confirmItemState = {
    contentData: sendItemInTransitData,
    setContentData: setSendItemInTransitData,
    errorModalOpen: sendItemInTransitErrorModalOpen,
    setIsErrorModalOpen: setSendItemInTransitErrorModalOpen,
  };
  const confirmItemProps = {
    ky,
    url: SEND_ITEM_IN_TRANSIT_URL,
  };
  const onCloseErrorModal = () => setSendItemInTransitErrorModalOpen(false);
  const handleSubmit = async ({ itemBarcode }) => {
    await handleConfirmItemSubmit(itemBarcode, confirmItemState, confirmItemProps);
  };

  return (
    <>
      <ConfirmItem
        paneTitle={intl.formatMessage({ id: 'ui-requests-mediated.sendItemInTransit.paneTitle' })}
        navigationMenuFunction={getSendItemInTransitUrl()}
        confirmItemType={CONFIRM_ITEM_TYPES.SEND_ITEM_IN_TRANSIT}
        contentData={sendItemInTransitData}
        onSubmit={handleSubmit}
      />
      <ErrorModal
        title={intl.formatMessage({ id: 'ui-requests-mediated.confirmItem.errorModal.sendItemInTransit.title' })}
        message={intl.formatMessage({ id: 'ui-requests-mediated.confirmItem.errorModal.sendItemInTransit.message' })}
        open={sendItemInTransitErrorModalOpen}
        onClose={onCloseErrorModal}
      />
    </>
  );
};

export default SendItemInTransit;
