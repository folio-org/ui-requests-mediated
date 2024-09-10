import {
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import ConfirmItem from '../ConfirmItem';
import ErrorModal from '../ErrorModal';

import {
  CONFIRM_ITEM_TYPES,
  getSendItemInTransitUrl,
} from '../../constants';

const SendItemInTransit = () => {
  const intl = useIntl();
  const [contentData] = useState([]);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const onCloseErrorModal = () => (setErrorModalOpen(false));
  const handleSubmit = () => {};

  return (
    <>
      <ConfirmItem
        paneTitle={intl.formatMessage({ id: 'ui-requests-mediated.sendItemInTransit.paneTitle' })}
        navigationMenuFunction={getSendItemInTransitUrl()}
        confirmItemType={CONFIRM_ITEM_TYPES.SEND_ITEM_IN_TRANSIT}
        contentData={contentData}
        onSubmit={handleSubmit}
      />
      <ErrorModal
        title={intl.formatMessage({ id: 'ui-requests-mediated.confirmItem.errorModal.sendItemInTransit.title' })}
        message={intl.formatMessage({ id: 'ui-requests-mediated.confirmItem.errorModal.sendItemInTransit.message' })}
        open={isErrorModalOpen}
        onClose={onCloseErrorModal}
      />
    </>
  );
};

export default SendItemInTransit;
