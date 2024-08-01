import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Headline,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { getUserHighlightBoxLink } from '../../../../utils';

import css from './UserHighlightBox.css';

const UserHighlightBox = ({
  title,
  name,
  id,
  barcode,
}) => {
  const recordLink = getUserHighlightBoxLink(name, id);
  const barcodeLink = getUserHighlightBoxLink(barcode, id);

  return (
    <Row>
      <Col xs={12}>
        <div className={`${css.section} ${css.active}`}>
          <Headline
            size="medium"
            tag="h3"
          >
            {title}
          </Headline>
          <div>
            {recordLink}
            {' '}
            <FormattedMessage id="ui-requests-mediated.requesterDetails.barcode" />:
            {' '}
            {barcode ? barcodeLink : <NoValue />}
          </div>
        </div>
      </Col>
    </Row>
  );
};

UserHighlightBox.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  barcode: PropTypes.string.isRequired,
};

export default UserHighlightBox;
