import PropTypes from 'prop-types';

import {
  PaneHeaderIconButton,
  PaneMenu,
} from '@folio/stripes/components';

import { ICONS } from '../../../../constants';

const RequestFormFirstMenu = ({ onCancel }) => {
  return (
    <PaneMenu>
      <PaneHeaderIconButton
        onClick={onCancel}
        icon={ICONS.TIMES}
      />
    </PaneMenu>
  );
};

RequestFormFirstMenu.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default RequestFormFirstMenu;
