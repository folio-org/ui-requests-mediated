import { FormattedMessage } from 'react-intl';

import {
  PaneHeaderIconButton,
  PaneMenu,
} from '@folio/stripes/components';

import { ICON_TYPES } from '../../../../constants';

const RequestFormFirstMenu = ({ onCancel }) => {
  return (
    <PaneMenu>
      <FormattedMessage id="ui-requests-mediated.form.closeRequest">
        {title => (
          <PaneHeaderIconButton
            onClick={onCancel}
            ariaLabel={title}
            icon={ICON_TYPES.TIMES}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );
};

export default RequestFormFirstMenu;
