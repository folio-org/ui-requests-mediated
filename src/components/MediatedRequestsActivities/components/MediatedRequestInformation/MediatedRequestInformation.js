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
  REQUEST_STATUSES_TRANSLATIONS,
  REQUEST_TYPE_TRANSLATIONS,
} from '../../../../constants';

const MediatedRequestInformation = ({
  requestId,
  metadata,
  requestType,
  requestStatus,
  requestLevel,
  patronComments,
}) => {
  const requestTypeTranslationKey = REQUEST_TYPE_TRANSLATIONS[requestType];
  const requestTypeMessage = requestTypeTranslationKey ? <FormattedMessage id={requestTypeTranslationKey} /> : <NoValue />;
  const requestStatusTranslationKey = REQUEST_STATUSES_TRANSLATIONS[requestStatus];
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
              <Link to={`/requests/view/${requestId}`}>
                <FormattedMessage id="ui-requests-mediated.mediatedRequestInformation.viewDetails" />
              </Link>
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
  requestId: PropTypes.string.isRequired,
  requestType: PropTypes.string.isRequired,
  requestStatus: PropTypes.string.isRequired,
  requestLevel: PropTypes.string.isRequired,
  metadata: PropTypes.object,
  patronComments: PropTypes.string,
};

export default MediatedRequestInformation;
