import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS,
  MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS,
} from '../../../../constants';

const MediatedRequestInformation = ({
  confirmedRequestId,
  metadata,
  requestType,
  requestStatus,
  requestLevel,
  patronComments,
}) => {
  const requestTypeTranslationKey = MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS[requestType];
  const requestTypeMessage = requestTypeTranslationKey ? <FormattedMessage id={requestTypeTranslationKey} /> : <NoValue />;
  const requestStatusTranslationKey = MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[requestStatus];
  const requestStatusMessage = requestStatusTranslationKey ? <FormattedMessage id={requestStatusTranslationKey} /> : <NoValue />;
  const requestLevelMessage = requestLevel ? <FormattedMessage id={`ui-requests-mediated.mediatedRequestInformation.level.${requestLevel.toLowerCase()}`} /> : <NoValue />;

  return (
    <>
      {
        metadata &&
          <Row>
            <Col xs={12}>
              <ViewMetaData metadata={metadata} />
            </Col>
          </Row>
      }
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.mediatedRequestInformation.requestType" />}
            value={requestTypeMessage}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.mediatedRequestInformation.status" />}
            value={requestStatusMessage}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.mediatedRequestInformation.level" />}
            value={requestLevelMessage}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.mediatedRequestInformation.confirmedRequest" />}
            value={
              confirmedRequestId ?
                <Link to={`/requests/view/${confirmedRequestId}`}>
                  <FormattedMessage id="ui-requests-mediated.mediatedRequestInformation.viewDetailsLink" />
                </Link> :
                <NoValue />
            }
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.mediatedRequestInformation.patronComments" />}
            value={patronComments}
          />
        </Col>
      </Row>
    </>
  );
};

MediatedRequestInformation.propTypes = {
  requestType: PropTypes.string.isRequired,
  requestStatus: PropTypes.string.isRequired,
  requestLevel: PropTypes.string.isRequired,
  confirmedRequestId: PropTypes.string,
  metadata: PropTypes.shape({
    createdByUserId: PropTypes.string,
    createdByUsername: PropTypes.string,
    createdDate: PropTypes.string,
    updatedByUserId: PropTypes.string,
    updatedByUsername: PropTypes.string,
    updatedDate: PropTypes.string,
  }),
  patronComments: PropTypes.string,
};

export default MediatedRequestInformation;
