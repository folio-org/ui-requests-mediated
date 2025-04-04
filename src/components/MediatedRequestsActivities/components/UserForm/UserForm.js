import PropTypes from 'prop-types';
import { useMemo } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { ProxyManager } from '@folio/stripes/smart-components';
import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import UserHighlightBox from '../UserHighlightBox';
import {
  getProxyInformation,
  getRequesterName,
  isProxyFunctionalityAvailable,
} from '../../../../utils';

import {
  REQUEST_PROP_TYPES,
} from '../../../../constants';

const UserForm = ({
  user,
  request,
  proxy,
  selectRequester,
  closeProxyManager,
  patronGroup = '',
  isEditMode,
  isEditPermission,
  isUserPreselected,
}) => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const name = getRequesterName(user);
  const ConnectedProxyManager = useMemo(() => stripes.connect(ProxyManager), [stripes]);
  const proxyInformation = getProxyInformation(proxy, request?.proxyUserId);
  const isProxyAvailable = isProxyFunctionalityAvailable();
  const isProxyManagerAvailable = (!isEditMode || (!isUserPreselected && isEditPermission)) && isProxyAvailable;
  const userSection =
    <UserHighlightBox
      title={<FormattedMessage id="ui-requests-mediated.requesterDetails.requester" />}
      name={name}
      id={user.id}
      barcode={user.barcode}
      ariaLabel={formatMessage({ id: 'ui-requests-mediated.requesterDetails.barcode.ariaLabel' })}
    />;
  const proxySection = (isProxyAvailable && proxyInformation.id) ?
    <UserHighlightBox
      title={<FormattedMessage id="ui-requests-mediated.requesterDetails.proxy" />}
      name={proxyInformation.name}
      id={proxyInformation.id}
      barcode={proxyInformation.barcode}
    /> :
    null;

  return (
    <div>
      {userSection}
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.requesterDetails.patronGroup" />}
            value={patronGroup}
          />
        </Col>
      </Row>
      {proxySection}
      {isProxyManagerAvailable &&
        <ConnectedProxyManager
          patron={user}
          proxy={proxy}
          onSelectPatron={selectRequester}
          onClose={closeProxyManager}
        />
      }
    </div>
  );
};

UserForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    barcode: PropTypes.string,
  }),
  request: REQUEST_PROP_TYPES,
  proxy: PropTypes.shape({
    id: PropTypes.string,
    barcode: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    middleName: PropTypes.string,
    preferredFirstName: PropTypes.string,
  }),
  patronGroup: PropTypes.string,
  selectRequester: PropTypes.func.isRequired,
  closeProxyManager: PropTypes.func.isRequired,
  isUserPreselected: PropTypes.bool.isRequired,
  isEditPermission: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default UserForm;
