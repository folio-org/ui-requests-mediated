import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export const MEDIATED_REQUESTS_RECORDS_NAME = 'mediatedRequestsRecords';

export const MEDIATED_REQUESTS_RECORD_FIELD_NAME = {
  TITLE: 'title',
  REQUESTER: 'requester',
  USER_FIRST_NAME: 'firstName',
  USER_LAST_NAME: 'lastName',
  USER_MIDDLE_NAME: 'middleName',
  PREFERRED_FIRST_NAME: 'preferredFirstName',
  ITEM: 'item',
  MEDIATED_REQUEST_DATE: 'requestDate',
  ITEM_BARCODE: 'itemBarcode',
  REQUESTER_BARCODE: 'requesterBarcode',
  EFFECTIVE_CALL_NUMBER: 'effectiveCallNumber',
  FULL_CALL_NUMBER: 'fullCallNumberIndex',
  STATUS: 'status',
  LEVEL: 'requestLevel',
};

export const MEDIATED_REQUESTS_RECORD_FIELD_PATH = {
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]: 'instance.title',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_FIRST_NAME]: 'requester.firstName',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_LAST_NAME]: 'requester.lastName',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_MIDDLE_NAME]: 'requester.middleName',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.PREFERRED_FIRST_NAME]: 'requester.preferredFirstName',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM]: 'item',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE]: 'requestDate',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]: 'item.barcode',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]: 'requester.barcode',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: 'searchIndex.callNumberComponents.callNumber',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.FULL_CALL_NUMBER]: 'fullCallNumberIndex',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS]: 'status',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.LEVEL]: 'requestLevel',
};

export const MEDIATED_REQUESTS_RECORD_TRANSLATIONS = {
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.mediatedRequestDate" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.title" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.itemBarcode" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.effectiveCallNumber" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.mediatedRequestStatus" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.requester" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.requesterBarcode" />,
};

export const MEDIATED_REQUEST_FILTER_TYPES = {
  MEDIATED_REQUEST_STATUS: MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS],
  MEDIATED_REQUEST_LEVELS: MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.LEVEL],
};

export const MEDIATED_REQUEST_STATUS = {
  CLOSED_CANCELLED: 'Closed - Cancelled',
  CLOSED_DECLINED: 'Closed - Declined',
  CLOSED_FILLED: 'Closed - Filled',
  NEW_AWAITING_CONFIRMATION: 'New - Awaiting confirmation',
  OPEN_AWAITING_PICKUP: 'Open - Awaiting pickup',
  OPEN_IN_PROGRESS: 'Open - In progress',
  OPEN_IN_TRANSIT: 'Open - In transit',
  OPEN_ITEM_ARRIVED: 'Open - Item arrived',
};

export const MEDIATED_REQUEST_STATUS_TRANSLATIONS = [
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.closedCancelled', value: MEDIATED_REQUEST_STATUS.CLOSED_CANCELLED },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.closedDeclined', value: MEDIATED_REQUEST_STATUS.CLOSED_DECLINED },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.closedFilled', value: MEDIATED_REQUEST_STATUS.CLOSED_FILLED },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.newAwaitingConfirmation', value: MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.openAwaitingPickup', value: MEDIATED_REQUEST_STATUS.OPEN_AWAITING_PICKUP },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.openInProgress', value: MEDIATED_REQUEST_STATUS.OPEN_IN_PROGRESS },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.openInTransit', value: MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.openItemArrived', value: MEDIATED_REQUEST_STATUS.OPEN_ITEM_ARRIVED },
];

export const MEDIATED_REQUEST_STATUS_PROP_TYPES = {
  [MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS]: PropTypes.arrayOf(PropTypes.shape({
    [MEDIATED_REQUEST_STATUS.CLOSED_DECLINED]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.CLOSED_FILLED]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_AWAITING_PICKUP]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_IN_PROGRESS]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_ITEM_ARRIVED]: PropTypes.string,
  })),
};

export const MEDIATED_REQUEST_LEVEL = {
  ITEM: 'Item',
  TITLE: 'Title',
};

export const MEDIATED_REQUEST_LEVEL_TRANSLATIONS = [
  { label: 'ui-requests-mediated.filters.mediatedRequestLevel.item', value: MEDIATED_REQUEST_LEVEL.ITEM },
  { label: 'ui-requests-mediated.filters.mediatedRequestLevel.title', value: MEDIATED_REQUEST_LEVEL.TITLE },
];

export const MEDIATED_REQUEST_LEVEL_PROP_TYPES = {
  [MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS]: PropTypes.arrayOf(PropTypes.shape({
    [MEDIATED_REQUEST_LEVEL.TITLE]: PropTypes.string,
    [MEDIATED_REQUEST_LEVEL.ITEM]: PropTypes.string,
  })),
};

export const STAFF_NOTES_DOMAIN_NAME = 'requests-mediated';
export const STAFF_NOTES_ENTITY_TYPE = 'request-mediated';
