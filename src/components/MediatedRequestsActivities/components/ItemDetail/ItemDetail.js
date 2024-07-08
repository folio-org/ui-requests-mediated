import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
  FormattedDate,
  NoValue,
} from '@folio/stripes/components';
import { effectiveCallNumber } from '@folio/stripes/util';
import { ClipCopy } from '@folio/stripes/smart-components';

import { isValidRequest } from '../../../../utils';
import {
  ITEM_STATUS_TRANSLATIONS,
  OPEN_REQUEST_STATUS_FILTERS,
  REQUEST_DATE_SORT_PARAM,
} from '../../../../constants';

const DEFAULT_COUNT_VALUE = 0;

const ItemDetail = ({
  request,
  item,
  loan,
  requestCount,
}) => {
  const itemId = request?.itemId || item.id;

  if (!itemId && !item.barcode) {
    return null;
  }

  const instanceId = request?.instanceId || item?.instanceId;
  const holdingsRecordId = request?.holdingsRecordId || item.holdingsRecordId;
  const title = request?.instance.title || item.title || <NoValue />;
  const contributor = request?.instance.contributorNames?.[0]?.name || item.contributors?.[0]?.name || <NoValue />;
  const count = request?.itemRequestCount || requestCount || DEFAULT_COUNT_VALUE;
  const status = item.status?.name || item.status;
  const statusMessage = <FormattedMessage id={ITEM_STATUS_TRANSLATIONS[status]} />;
  const effectiveLocationName = item.location?.name || <NoValue />;
  const dueDate = loan?.dueDate ? <FormattedDate value={loan.dueDate} /> : <NoValue />;
  const effectiveCallNumberString = effectiveCallNumber(item);
  const positionLink = count
    ? (
      <Link to={`/requests?filters=${OPEN_REQUEST_STATUS_FILTERS}&query=${itemId}&sort=${REQUEST_DATE_SORT_PARAM}`}>
        {count}
      </Link>
    )
    : count;
  const itemLabel = item.barcode ? 'ui-requests-mediated.itemDetails.barcode' : 'ui-requests-mediated.itemDetails.id';
  const isRequestValid = isValidRequest({ instanceId, holdingsRecordId });
  const getRecordLink = () => {
    if (itemId) {
      return isRequestValid
        ? <Link to={`/inventory/view/${instanceId}/${holdingsRecordId}/${itemId}`}>{item.barcode || itemId}</Link>
        : (item.barcode || itemId);
    }

    return <NoValue />;
  };

  return (
    <>
      <Row>
        <Col xs={4}>
          <KeyValue
            data-testid="itemBarcodeLink"
            label={<FormattedMessage id={itemLabel} />}
            value={
              <>
                {getRecordLink()}
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
        <Col xs={4}>
          <KeyValue
            label={<FormattedMessage id="ui-requests-mediated.itemDetails.requestsOnItem" />}
            value={positionLink}
          />
        </Col>
      </Row>
    </>
  );
};

ItemDetail.propTypes = {
  item: PropTypes.object.isRequired,
  loan: PropTypes.object,
  requestCount: PropTypes.number,
  request: PropTypes.object,
};

export default ItemDetail;
