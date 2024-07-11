import PropTypes from 'prop-types';

import {
  PaneHeaderIconButton,
  PaneMenu,
} from '@folio/stripes/components';

import { ICON_TYPES } from '../../../../constants';

const RequestFormFirstMenu = ({ onCancel }) => {
  return (
    <PaneMenu>
      <PaneHeaderIconButton
        onClick={onCancel}
        icon={ICON_TYPES.TIMES}
      />
    </PaneMenu>
  );
};

RequestFormFirstMenu.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default RequestFormFirstMenu;
