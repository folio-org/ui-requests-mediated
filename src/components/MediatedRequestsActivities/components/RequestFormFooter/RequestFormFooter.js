import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

import { SAVE_BUTTON_ID } from '../../../../constants';

import styles from './RequestFormFooter.css';

const RequestFormFooter = ({
  onCancel,
  isSaveAndCloseButtonDisabled,
  isConfirmButtonDisabled,
}) => {
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
            disabled={isSaveAndCloseButtonDisabled}
            marginBottom0
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
          <Button
            id="confirmRequestButton"
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
