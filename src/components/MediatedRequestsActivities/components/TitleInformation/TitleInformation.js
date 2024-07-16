import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';

import { getFormattedYears } from '../../../../utils';
import { DEFAULT_DISPLAYED_YEARS_AMOUNT } from '../../../../constants';

export const TEXT_SEPARATOR = ', ';
export const CONTRIBUTOR_SEPARATOR = '; ';
export const MAX_IDENTIFIERS_COUNT = 4;

const TitleInformation = (props) => {
  const {
    instanceId,
    title,
    contributors = [],
    publications = [],
    editions = [],
    identifiers = [],
  } = props;
  const instanceTitle = <Link to={`/inventory/view/${instanceId}`}>{title}</Link>;
  const instanceContributors = contributors.map(({ name }) => name).join(CONTRIBUTOR_SEPARATOR);
  const instanceEditions = editions.map(({ name }) => name).join(TEXT_SEPARATOR);
  const instanceIdentifiers = identifiers.slice(0, MAX_IDENTIFIERS_COUNT).map(({ value }) => value).join(TEXT_SEPARATOR);
  const formattedYears = getFormattedYears(publications, DEFAULT_DISPLAYED_YEARS_AMOUNT);

  return (
    <>
      <Row>
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
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.instanceDetails.publicationDate" />}
            value={formattedYears}
          />
        </Col>
      </Row>
      <Row>
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

export default TitleInformation;
