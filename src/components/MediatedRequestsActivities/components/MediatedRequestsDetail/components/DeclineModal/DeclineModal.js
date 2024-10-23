import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const DeclineModal = ({
  open,
  title,
  onConfirm,
  onClose,
}) => {
  const footer = (
    <ModalFooter>
      <Button
        data-testid="confirmButton"
        buttonStyle="primary"
        onClick={onConfirm}
      >
        <FormattedMessage id="ui-requests-mediated.declineModal.confirm" />
      </Button>
      <Button
        data-testid="backButton"
        onClick={onClose}
      >
        <FormattedMessage id="ui-requests-mediated.declineModal.back" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      dismissible
      label={<FormattedMessage id="ui-requests-mediated.declineModal.title" />}
      open={open}
      size="small"
      footer={footer}
      onClose={onClose}
    >
      <FormattedMessage
        id="ui-requests-mediated.declineModal.message"
        values={{ title }}
      />
    </Modal>
  );
};

DeclineModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeclineModal;
