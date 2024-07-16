import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

import { SAVE_BUTTON_ID } from '../../../../constants';

const RequestFormFooter = ({
  onCancel,
  isSubmittingDisabled,
  footerClass,
}) => {
  return (
    <PaneFooter>
      <div className={footerClass}>
        <Button
          id="cancelRequestButton"
          buttonStyle="default mega"
          onClick={onCancel}
          marginBottom0
        >
          <FormattedMessage id="ui-requests-mediated.form.cancelButton" />
        </Button>
        <Button
          id={SAVE_BUTTON_ID}
          type="submit"
          buttonStyle="primary mega"
          disabled={isSubmittingDisabled}
          marginBottom0
        >
          <FormattedMessage id="stripes-components.saveAndClose" />
        </Button>
        <Button
          id="confirmRequestButton"
          type="submit"
          buttonStyle="primary mega"
          disabled={isSubmittingDisabled}
          marginBottom0
        >
          <FormattedMessage id="ui-requests-mediated.form.confirmButton" />
        </Button>
      </div>
    </PaneFooter>
  );
};

RequestFormFooter.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isSubmittingDisabled: PropTypes.bool.isRequired,
  footerClass: PropTypes.string.isRequired,
};

export default RequestFormFooter;
