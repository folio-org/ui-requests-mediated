import React, {
  useState,
  useRef,
} from 'react';
import { useIntl } from 'react-intl';
import ReactToPrint from 'react-to-print';

import {
  useOkapiKy,
} from '@folio/stripes/core';

import ConfirmItem from '../ConfirmItem';
import ErrorModal from '../ErrorModal';

import {
  CONFIRM_ITEM_TYPES,
  STAFF_SLIPS_TYPE,
  getSendItemInTransitUrl,
} from '../../constants';
import {
  handleConfirmItemSubmit,
  getStaffSlipsTemplateByType,
} from '../../utils';
import {
  useStaffSlipsTemplate,
} from '../../hooks';

import ContentToPrint from './components';

import css from './SendItemInTransit.css';

const SEND_ITEM_IN_TRANSIT_URL = 'requests-mediated/send-item-in-transit';
const PRINT_BUTTON_SELECTOR = 'printButton';
const CONTENT_TO_PRINT_ID = 'contentToPrint';

const SendItemInTransit = () => {
  const contentToPrintRef = useRef();
  const intl = useIntl();
  const ky = useOkapiKy();
  const [sendItemInTransitData, setSendItemInTransitData] = useState([]);
  const [staffSlipContext, setStaffSlipContext] = useState(null);
  const [sendItemInTransitErrorModalOpen, setSendItemInTransitErrorModalOpen] = useState(false);
  const { staffSlips } = useStaffSlipsTemplate();
  const transitMediatedRequestsTemplate = getStaffSlipsTemplateByType(staffSlips, STAFF_SLIPS_TYPE.TRANSIT_MEDIATED_REQUESTS);
  const confirmItemState = {
    contentData: sendItemInTransitData,
    setContentData: setSendItemInTransitData,
    errorModalOpen: sendItemInTransitErrorModalOpen,
    setIsErrorModalOpen: setSendItemInTransitErrorModalOpen,
  };
  const confirmItemProps = {
    ky,
    url: SEND_ITEM_IN_TRANSIT_URL,
    onSuccess: (data) => {
      setStaffSlipContext(data);

      const checkPrintingContentHasAlreadyBeenRendered = () => {
        if (document.getElementById(CONTENT_TO_PRINT_ID)) {
          document.getElementById(PRINT_BUTTON_SELECTOR).click();
        } else {
          setTimeout(() => {
            checkPrintingContentHasAlreadyBeenRendered();
          }, 300);
        }
      };

      checkPrintingContentHasAlreadyBeenRendered();
    },
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
      <ReactToPrint
        removeAfterPrint
        trigger={() => <button id={PRINT_BUTTON_SELECTOR} type="button">{PRINT_BUTTON_SELECTOR}</button>}
        content={() => contentToPrintRef.current}
        onAfterPrint={() => {
          setStaffSlipContext(null);
        }}
      />
      <div className={css.hiddenContent}>
        <div ref={contentToPrintRef}>
          <ContentToPrint
            contentToPrintId={CONTENT_TO_PRINT_ID}
            template={transitMediatedRequestsTemplate}
            dataSource={staffSlipContext}
          />
        </div>
      </div>
    </>
  );
};

export default SendItemInTransit;
