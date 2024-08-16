import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

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
} from '../../../../utils';

const UserForm = ({
  user,
  request,
  proxy,
  selectProxy,
  handleCloseProxy,
  patronGroup = '',
}) => {
  const stripes = useStripes();
  const id = user?.id ?? request.requesterId;
  const name = getRequesterName(user);
  const ConnectedProxyManager = useMemo(() => stripes.connect(ProxyManager), [stripes]);
  const proxyInformation = getProxyInformation(proxy, request?.proxyUserId);
  const userSection = proxyInformation.id ?
    <UserHighlightBox
      title={<FormattedMessage id="ui-requests-mediated.requesterDetails.requester" />}
      name={proxyInformation.name}
      id={proxyInformation.id}
      barcode={proxyInformation.barcode}
    /> :
    <UserHighlightBox
      title={<FormattedMessage id="ui-requests-mediated.requesterDetails.requester" />}
      name={name}
      id={id}
      barcode={user.barcode}
    />;
  const proxySection = proxyInformation.id ?
    <UserHighlightBox
      title={<FormattedMessage id="ui-requests-mediated.requesterDetails.proxy" />}
      name={name}
      id={id}
      barcode={user.barcode}
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
      <ConnectedProxyManager
        patron={user}
        proxy={proxy}
        onSelectPatron={selectProxy}
        onClose={handleCloseProxy}
      />
    </div>
  );
};

UserForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    barcode: PropTypes.string,
  }),
  request: PropTypes.shape({
    requesterId: PropTypes.string,
    proxyUserId: PropTypes.string,
  }),
  proxy: PropTypes.object,
  patronGroup: PropTypes.string,
  selectProxy: PropTypes.func.isRequired,
  handleCloseProxy: PropTypes.func.isRequired,
};

export default UserForm;
