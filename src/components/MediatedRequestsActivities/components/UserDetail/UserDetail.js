import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { getRequesterName } from '../../../../utils';
import UserHighlightBox from '../UserHighlightBox';

const UserDetail = ({
  user,
  patronGroup = '',
  request,
}) => {
  const id = user?.id ?? request.requesterId;
  const name = getRequesterName(user);

  return (
    <div>
      <UserHighlightBox
        title={<FormattedMessage id="ui-requests-mediated.requesterDetails.title" />}
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
      </Row>
    </div>
  );
};

UserDetail.propTypes = {
  patronGroup: PropTypes.string,
  user: PropTypes.object.isRequired,
  request: PropTypes.object,
};

export default UserDetail;
