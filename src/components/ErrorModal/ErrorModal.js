import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

const ErrorModal = ({
  title,
  message,
  open,
  onClose,
}) => {
  const footer = (
    <ModalFooter>
      <Button
        data-testid="closeButton"
        buttonStyle="primary"
        autoFocus
        onClick={onClose}
      >
        <FormattedMessage id="ui-requests-mediated.confirmItem.errorModal.close" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      dismissible
      label={title}
      open={open}
      size="small"
      footer={footer}
      onClose={onClose}
    >
      {message}
    </Modal>
  );
};

ErrorModal.propTypes = {
  title: PropTypes.node.isRequired,
  message: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorModal;
