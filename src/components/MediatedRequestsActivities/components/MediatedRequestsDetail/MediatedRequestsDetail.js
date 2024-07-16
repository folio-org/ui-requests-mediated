import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  get,
} from 'lodash';

import {
  IfPermission,
} from '@folio/stripes/core';
import {
  Button,
  Icon,
  Pane,
} from '@folio/stripes/components';

import {
  useMediatedRequestById,
} from '../../../../hooks';
import {
  DEFAULT_VIEW_VALUE,
  ICONS,
  MEDIATED_REQUEST_STATUS,
  MEDIATED_REQUESTS_ACTIVITIES,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME,
  MEDIATED_REQUESTS_RECORD_FIELD_PATH,
  MODULE_ROUTE,
} from '../../../../constants';

const DETAIL_PANE_WIDTH = '44%';

const MediatedRequestsDetail = ({
  stripes,
}) => {
  const history = useHistory();
  const location = useLocation();
  const mediatedRequestIdFromPathname = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

  const { formatMessage } = useIntl();
  const { mediatedRequest } = useMediatedRequestById(mediatedRequestIdFromPathname);

  const isActionMenuVisible = () => (
    get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS], DEFAULT_VIEW_VALUE) === MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION
      ? stripes.hasPerm('ui-requests-mediated.view-create-edit') || stripes.hasPerm('ui-requests-mediated.view-decline')
      : false
  );
  const showActionMenu = isActionMenuVisible();

  const onClose = () => {
    history.push(`/${MODULE_ROUTE}/${MEDIATED_REQUESTS_ACTIVITIES}${location.search}`);
  };

  const actionMenu = ({ onToggle }) => {
    return (
      <>
        <IfPermission perm="ui-requests-mediated.view-create-edit">
          <Button
            buttonStyle="dropdownItem"
            marginBottom0
            onClick={onToggle}
          >
            <Icon icon={ICONS.EDIT}>
              <FormattedMessage id="ui-requests-mediated.mediatedRequestDetails.actionMenu.editAndConfirm" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="ui-requests-mediated.view-decline">
          <Button
            buttonStyle="dropdownItem"
            marginBottom0
            onClick={onToggle}
          >
            <Icon icon={ICONS.TIMES_CIRCLE}>
              <FormattedMessage id="ui-requests-mediated.mediatedRequestDetails.actionMenu.decline" />
            </Icon>
          </Button>
        </IfPermission>
      </>
    );
  };

  return (
    <Pane
      id="mediatedRequestsDetailPane"
      data-testid="mediatedRequestsDetailPane"
      defaultWidth={DETAIL_PANE_WIDTH}
      paneTitle={formatMessage({ id:'ui-requests-mediated.mediatedRequestDetails.paneTitle' })}
      dismissible
      onClose={onClose}
      {... (showActionMenu ? { actionMenu } : {})}
    >
      {get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE], DEFAULT_VIEW_VALUE)}
    </Pane>
  );
};

MediatedRequestsDetail.propTypes = {
  stripes: PropTypes.object.isRequired,
};

export default MediatedRequestsDetail;
