import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import {
  getRequesterName,
  getProxyInformation,
  isProxyFunctionalityAvailable,
} from '../../../../utils';
import UserHighlightBox from '../UserHighlightBox';

import {
  REQUEST_PROP_TYPES,
} from '../../../../constants';

const UserDetail = ({
  user,
  request,
  userPreferences,
  proxy,
  patronGroup = '',
}) => {
  const { formatMessage } = useIntl();
  const id = user?.id ?? request.requesterId;
  const name = getRequesterName(user);
  const proxyInformation = getProxyInformation(proxy, request.proxyUserId);
  const proxySection = (isProxyFunctionalityAvailable() && proxyInformation.id) ?
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
        ariaLabel={formatMessage({ id: 'ui-requests-mediated.requesterDetails.barcode.ariaLabel' })}
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
  user: PropTypes.shape({
    id: PropTypes.string,
    barcode: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    middleName: PropTypes.string,
    preferredFirstName: PropTypes.string,
  }).isRequired,
  request: REQUEST_PROP_TYPES,
  userPreferences: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  proxy: PropTypes.shape({
    id: PropTypes.string,
    barcode: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    middleName: PropTypes.string,
    preferredFirstName: PropTypes.string,
  }),
};

export default UserDetail;
