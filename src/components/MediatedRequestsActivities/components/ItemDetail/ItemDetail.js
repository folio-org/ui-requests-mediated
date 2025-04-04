import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
  FormattedDate,
  NoValue,
} from '@folio/stripes/components';
import { effectiveCallNumber } from '@folio/stripes/util';
import { ClipCopy } from '@folio/stripes/smart-components';

import {
  ITEM_STATUS_TRANSLATION_KEYS,
  REQUEST_PROP_TYPES,
} from '../../../../constants';

import css from './ItemDetail.css';

const ItemDetail = ({
  request,
  item,
  loan,
}) => {
  const { formatMessage } = useIntl();
  const itemId = request?.itemId || item.id;

  if (!itemId && !item.barcode) {
    return null;
  }

  const instanceId = request?.instanceId || item?.instanceId;
  const holdingsRecordId = request?.holdingsRecordId || item.holdingsRecordId;
  const title = request?.instance.title || item.title || <NoValue />;
  const contributor = request?.instance.contributorNames?.[0]?.name || item.contributors?.[0]?.name || <NoValue />;
  const status = item.status?.name || item.status;
  const statusMessage = ITEM_STATUS_TRANSLATION_KEYS[status] ? <FormattedMessage id={ITEM_STATUS_TRANSLATION_KEYS[status]} /> : <NoValue />;
  const effectiveLocationName = item.location?.name || <NoValue />;
  const dueDate = loan?.dueDate ? <FormattedDate value={loan.dueDate} /> : <NoValue />;
  const effectiveCallNumberString = effectiveCallNumber(item);
  const itemLabel = item.barcode ? 'ui-requests-mediated.itemDetails.barcode' : 'ui-requests-mediated.itemDetails.id';
  const recordLink = itemId ?
    <Link
      aria-label={formatMessage({ id: 'ui-requests-mediated.itemDetails.barcode.ariaLabel' })}
      to={`/inventory/view/${instanceId}/${holdingsRecordId}/${itemId}`}
      className={css.itemLink}
    >
      {item.barcode || itemId}
    </Link> :
    item.barcode || <NoValue />;

  return (
    <>
      <Row>
        <Col xs={4}>
          <KeyValue
            data-testid="itemBarcodeLink"
            label={<FormattedMessage id={itemLabel} />}
            value={
              <>
                {recordLink}
                {
                  Boolean(item.barcode) && (
                    <ClipCopy text={item.barcode} />
                  )
                }
              </>
            }
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.itemDetails.title" />}
            value={title}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.itemDetails.contributor" />}
            value={contributor}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.itemDetails.effectiveLocation" />}
            value={effectiveLocationName}
          />
        </Col>
        <Col xs={8}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.itemDetails.callNumber" />}
            value={effectiveCallNumberString}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.itemDetails.status" />}
            value={statusMessage}
          />
        </Col>
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.itemDetails.dueDate" />}
            value={dueDate}
          />
        </Col>
      </Row>
    </>
  );
};

ItemDetail.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    barcode: PropTypes.string,
    instanceId: PropTypes.string,
    holdingsRecordId: PropTypes.string,
    location: PropTypes.shape({
      name: PropTypes.string,
    }),
    status: PropTypes.shape({
      name: PropTypes.string,
    }),
    contributors: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
  }).isRequired,
  loan: PropTypes.shape({
    dueDate: PropTypes.string,
  }),
  request: REQUEST_PROP_TYPES,
};

export default ItemDetail;
