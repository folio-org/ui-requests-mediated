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
  getConfirmItemArrivalUrl,
} from '../../constants';
import {
  handleConfirmItemSubmit,
} from '../../utils';

const CONFIRM_ITEM_ARRIVAL_URL = 'requests-mediated/confirm-item-arrival';

const ConfirmItemArrival = () => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [confirmItemArrivalData, setConfirmItemArrivalData] = useState([]);
  const [confirmItemArrivalErrorModalOpen, setConfirmItemArrivalErrorModalOpen] = useState(false);
  const confirmItemState = {
    contentData: confirmItemArrivalData,
    setContentData: setConfirmItemArrivalData,
    errorModalOpen: confirmItemArrivalErrorModalOpen,
    setIsErrorModalOpen: setConfirmItemArrivalErrorModalOpen,
  };
  const confirmItemProps = {
    ky,
    url: CONFIRM_ITEM_ARRIVAL_URL,
  };
  const onCloseErrorModal = () => setConfirmItemArrivalErrorModalOpen(false);
  const handleSubmit = async ({ itemBarcode }) => {
    await handleConfirmItemSubmit(itemBarcode, confirmItemState, confirmItemProps);
  };

  return (
    <>
      <ConfirmItem
        paneTitle={intl.formatMessage({ id: 'ui-requests-mediated.confirmItemArrival.paneTitle' })}
        navigationMenuFunction={getConfirmItemArrivalUrl()}
        confirmItemType={CONFIRM_ITEM_TYPES.CONFIRM_ITEM_ARRIVAL}
        contentData={confirmItemArrivalData}
        onSubmit={handleSubmit}
      />
      <ErrorModal
        title={intl.formatMessage({ id: 'ui-requests-mediated.confirmItem.errorModal.confirmItemArrival.title' })}
        message={intl.formatMessage({ id: 'ui-requests-mediated.confirmItem.errorModal.confirmItemArrival.message' })}
        open={confirmItemArrivalErrorModalOpen}
        onClose={onCloseErrorModal}
      />
    </>
  );
};

export default ConfirmItemArrival;
