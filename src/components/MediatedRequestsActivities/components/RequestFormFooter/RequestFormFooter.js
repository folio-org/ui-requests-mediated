import { FormattedMessage } from 'react-intl';

import {
  Button,
  PaneFooter,
} from '@folio/stripes/components';

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
          id="saveRequestButton"
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

export default RequestFormFooter;
