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

const ConfirmItemArrival = () => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [contentData, setContentData] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const onCloseErrorModal = () => setIsErrorModalOpen(false);
  const handleSubmit = ({ itemBarcode }) => {
    ky.post('requests-mediated/confirm-item-arrival', {
      json: { itemBarcode },
    }).json()
      .then((resp) => {
        setContentData([resp].concat(contentData));
      })
      .catch(() => {
        setIsErrorModalOpen(true);
      });
  };

  return (
    <>
      <ConfirmItem
        paneTitle={intl.formatMessage({ id: 'ui-requests-mediated.confirmItemArrival.paneTitle' })}
        navigationMenuFunction={getConfirmItemArrivalUrl()}
        confirmItemType={CONFIRM_ITEM_TYPES.CONFIRM_ITEM_ARRIVAL}
        contentData={contentData}
        onSubmit={handleSubmit}
      />
      <ErrorModal
        title={intl.formatMessage({ id: 'ui-requests-mediated.confirmItem.errorModal.confirmItemArrival.title' })}
        message={intl.formatMessage({ id: 'ui-requests-mediated.confirmItem.errorModal.confirmItemArrival.message' })}
        open={isErrorModalOpen}
        onClose={onCloseErrorModal}
      />
    </>
  );
};

export default ConfirmItemArrival;
