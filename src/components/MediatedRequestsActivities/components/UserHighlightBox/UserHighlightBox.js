import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Col,
  Headline,
  NoValue,
  Row,
} from '@folio/stripes/components';

import css from './UserHighlightBox.css';

const UserHighlightBox = ({
  title,
  name,
  id,
  barcode,
}) => {
  const getHighlightBoxLink = (text, id) => {
    return text ? <Link to={`/users/view/${id}`}>{text}</Link> : '';
  };
  const recordLink = getHighlightBoxLink(name, id);
  const barcodeLink = getHighlightBoxLink(barcode, id);

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

export default UserHighlightBox;
