import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';

import { getFormattedYears } from '../../../../utils';
import {
  DEFAULT_DISPLAYED_YEARS_AMOUNT,
  REQUEST_LEVEL_TYPES,
  OPEN_REQUEST_STATUS_FILTERS,
} from '../../../../constants';

export const TEXT_SEPARATOR = ', ';
export const CONTRIBUTOR_SEPARATOR = '; ';
export const MAX_IDENTIFIERS_COUNT = 4;
export const REQUEST_DATE = 'Request Date';

export const getRequestsURL = (id, count) => <Link to={`/mediated-requests-activities?filters=${OPEN_REQUEST_STATUS_FILTERS},requestLevels.${REQUEST_LEVEL_TYPES.TITLE}&query=${id}&sort=${REQUEST_DATE}`}>{count}</Link>;
export const getTitleURL = (id, title) => <Link to={`/inventory/view/${id}`}>{title}</Link>;
export const getContributors = (data, separator) => data.map(({ name }) => name).join(separator);
export const getEditions = (data, separator) => data.join(separator);
export const getIdentifiers = (data, separator, limit) => data.slice(0, limit).map(({ value }) => value).join(separator);

const TitleInformation = (props) => {
  const {
    titleLevelRequestsLink,
    instanceId,
    titleLevelRequestsCount,
    title,
    contributors,
    publications,
    editions,
    identifiers,
  } = props;
  const titleLevelRequestsAmount = titleLevelRequestsLink ? getRequestsURL(instanceId, titleLevelRequestsCount) : titleLevelRequestsCount;
  const instanceTitle = getTitleURL(instanceId, title);
  const instanceContributors = getContributors(contributors, CONTRIBUTOR_SEPARATOR);
  const instanceEditions = getEditions(editions, TEXT_SEPARATOR);
  const instanceIdentifiers = getIdentifiers(identifiers, TEXT_SEPARATOR, MAX_IDENTIFIERS_COUNT)
  const formattedYears = getFormattedYears(publications, DEFAULT_DISPLAYED_YEARS_AMOUNT);

  return (
    <>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.instanceDetails.tlr" />}
            value={titleLevelRequestsAmount}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.instanceDetails.title" />}
            value={instanceTitle}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.instanceDetails.contributor" />}
            value={instanceContributors}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.instanceDetails.publicationDate" />}
            value={formattedYears}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.instanceDetails.edition" />}
            value={instanceEditions}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.instanceDetails.identifiers" />}
            value={instanceIdentifiers}
          />
        </Col>
      </Row>
    </>
  );
};

TitleInformation.propTypes = {
  titleLevelRequestsLink: PropTypes.bool,
  titleLevelRequestsCount: PropTypes.number.isRequired,
  instanceId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contributors: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
  publications: PropTypes.arrayOf(PropTypes.shape({
    dateOfPublication: PropTypes.string,
  })),
  editions: PropTypes.arrayOf(PropTypes.string),
  identifiers: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
  })),
};

TitleInformation.defaultProps = {
  contributors: [],
  publications: [],
  editions: [],
  identifiers: [],
  titleLevelRequestsLink: true,
};

export default TitleInformation;
