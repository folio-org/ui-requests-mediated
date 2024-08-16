import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import {
  getRequesterName,
  getProxyInformation,
} from '../../../../utils';
import UserHighlightBox from '../UserHighlightBox';

const UserDetail = ({
  user,
  request,
  userPreferences,
  proxy,
  patronGroup = '',
}) => {
  const id = user?.id ?? request.requesterId;
  const name = getRequesterName(user);
  const proxyInformation = getProxyInformation(proxy, request.proxyUserId);
  const proxySection = proxyInformation.id ?
    <UserHighlightBox
      title={<FormattedMessage id="ui-requests-mediated.requesterDetails.proxy" />}
      name={proxyInformation.name}
      id={proxyInformation.id}
      barcode={proxyInformation.barcode}
    /> :
    null;

  return (
    <div>
      <UserHighlightBox
        title={<FormattedMessage id="ui-requests-mediated.requesterDetails.requester" />}
        name={name}
        id={id}
        barcode={user.barcode}
      />
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.requesterDetails.patronGroup" />}
            value={patronGroup}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.requesterDetails.fulfillmentPreference" />}
            value={request.fulfillmentPreference}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={userPreferences.label}
            value={userPreferences.value}
          />
        </Col>
      </Row>
      {proxySection}
    </div>
  );
};

UserDetail.propTypes = {
  patronGroup: PropTypes.string,
  user: PropTypes.object.isRequired,
  request: PropTypes.object,
  userPreferences: PropTypes.object,
  proxy: PropTypes.object,
};

export default UserDetail;
