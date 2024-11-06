import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import {
  CONFIRM_BUTTON_ID,
  SAVE_BUTTON_ID,
} from '../../../../constants';

import styles from './RequestFormFooter.css';

const RequestFormFooter = ({
  onCancel,
  isSaveAndCloseButtonDisabled,
  isConfirmButtonDisabled,
}) => {
  const stripes = useStripes();
  const isSaveAndCloseDisabled = isSaveAndCloseButtonDisabled || !stripes.hasPerm('ui-requests-mediated.requests-mediated.view-create-edit.execute');

  return (
    <PaneFooter
      renderStart={
        <Button
          id="cancelRequestButton"
          buttonStyle="default mega"
          onClick={onCancel}
          marginBottom0
        >
          <FormattedMessage id="ui-requests-mediated.form.cancelButton" />
        </Button>
      }
      renderEnd={
        <>
          <Button
            id={SAVE_BUTTON_ID}
            type="submit"
            buttonClass={styles.saveAndCloseButton}
            buttonStyle="default mega"
            disabled={isSaveAndCloseDisabled}
            marginBottom0
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
          <Button
            id={CONFIRM_BUTTON_ID}
            type="submit"
            buttonStyle="primary mega"
            disabled={isConfirmButtonDisabled}
            marginBottom0
          >
            <FormattedMessage id="ui-requests-mediated.form.confirmButton" />
          </Button>
        </>
      }
    />
  );
};

RequestFormFooter.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isSaveAndCloseButtonDisabled: PropTypes.bool.isRequired,
  isConfirmButtonDisabled: PropTypes.bool.isRequired,
};

export default RequestFormFooter;
