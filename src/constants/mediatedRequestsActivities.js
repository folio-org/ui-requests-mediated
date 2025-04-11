import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export const MEDIATED_REQUESTS_RECORDS_NAME = 'mediatedRequestsRecords';

export const MEDIATED_REQUEST_SEARCH_PARAMS = {
  INSTANCE_TITLE: 'instanceTitle',
  ITEM_BARCODE: 'itemBarcode',
  REQUESTER_BARCODE: 'requesterBarcode',
  CALL_NUMBER: 'callNumber',
  FULL_CALL_NUMBER: 'fullCallNumber',
};

export const MEDIATED_REQUESTS_RECORD_FIELD_NAME = {
  ID: 'id',
  TITLE: 'instanceTitle',
  REQUESTER: 'requester',
  USER_FIRST_NAME: 'requesterFirstName',
  USER_LAST_NAME: 'requesterLastName',
  USER_MIDDLE_NAME: 'middleName',
  PREFERRED_FIRST_NAME: 'preferredFirstName',
  ITEM: 'item',
  MEDIATED_REQUEST_DATE: 'requestDate',
  ITEM_BARCODE: 'itemBarcode',
  REQUESTER_BARCODE: 'requesterBarcode',
  EFFECTIVE_CALL_NUMBER: 'shelvingOrder',
  STATUS: 'mediatedRequestStatus',
  LEVEL: 'requestLevel',
};

export const USER_NAMES = {
  USER_FIRST_NAME: 'firstName',
  USER_LAST_NAME: 'lastName',
  USER_MIDDLE_NAME: 'middleName',
  PREFERRED_FIRST_NAME: 'preferredFirstName',
};

export const MEDIATED_REQUESTS_RECORD_FIELD_PATH = {
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]: 'instance.title',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_FIRST_NAME]: `requester.${USER_NAMES.USER_FIRST_NAME}`,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_LAST_NAME]: `requester.${USER_NAMES.USER_LAST_NAME}`,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_MIDDLE_NAME]: `requester.${USER_NAMES.USER_MIDDLE_NAME}`,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.PREFERRED_FIRST_NAME]: `requester.${USER_NAMES.PREFERRED_FIRST_NAME}`,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM]: 'item',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE]: 'requestDate',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]: 'item.barcode',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]: 'requester.barcode',
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: 'searchIndex.callNumberComponents.callNumber',
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
  OPEN_AWAITING_DELIVERY: 'Open - Awaiting delivery',
  OPEN_AWAITING_PICKUP: 'Open - Awaiting pickup',
  OPEN_IN_TRANSIT_FOR_APPROVAL: 'Open - In transit for approval',
  OPEN_IN_TRANSIT_TO_BE_CHECKED_OUT: 'Open - In transit to be checked out',
  OPEN_ITEM_ARRIVED: 'Open - Item arrived',
  OPEN_NOT_YET_FILLED: 'Open - Not yet filled',
};

export const MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS = {
  [MEDIATED_REQUEST_STATUS.CLOSED_CANCELLED]: 'ui-requests-mediated.mediatedRequestStatus.closedCancelled',
  [MEDIATED_REQUEST_STATUS.CLOSED_DECLINED]: 'ui-requests-mediated.mediatedRequestStatus.closedDeclined',
  [MEDIATED_REQUEST_STATUS.CLOSED_FILLED]: 'ui-requests-mediated.mediatedRequestStatus.closedFilled',
  [MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION]: 'ui-requests-mediated.mediatedRequestStatus.newAwaitingConfirmation',
  [MEDIATED_REQUEST_STATUS.OPEN_AWAITING_DELIVERY]: 'ui-requests-mediated.mediatedRequestStatus.openAwaitingDelivery',
  [MEDIATED_REQUEST_STATUS.OPEN_AWAITING_PICKUP]: 'ui-requests-mediated.mediatedRequestStatus.openAwaitingPickup',
  [MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT_FOR_APPROVAL]: 'ui-requests-mediated.mediatedRequestStatus.openInTransitForApproval',
  [MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT_TO_BE_CHECKED_OUT]: 'ui-requests-mediated.mediatedRequestStatus.openInTransitToBeCheckedOut',
  [MEDIATED_REQUEST_STATUS.OPEN_ITEM_ARRIVED]: 'ui-requests-mediated.mediatedRequestStatus.openItemArrived',
  [MEDIATED_REQUEST_STATUS.OPEN_NOT_YET_FILLED]: 'ui-requests-mediated.mediatedRequestStatus.openNotYetFilled',
};

export const MEDIATED_REQUEST_STATUS_TRANSLATIONS = [
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.CLOSED_CANCELLED], value: MEDIATED_REQUEST_STATUS.CLOSED_CANCELLED },
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.CLOSED_DECLINED], value: MEDIATED_REQUEST_STATUS.CLOSED_DECLINED },
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.CLOSED_FILLED], value: MEDIATED_REQUEST_STATUS.CLOSED_FILLED },
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION], value: MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION },
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.OPEN_AWAITING_DELIVERY], value: MEDIATED_REQUEST_STATUS.OPEN_AWAITING_DELIVERY },
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.OPEN_AWAITING_PICKUP], value: MEDIATED_REQUEST_STATUS.OPEN_AWAITING_PICKUP },
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT_FOR_APPROVAL], value: MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT_FOR_APPROVAL },
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT_TO_BE_CHECKED_OUT], value: MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT_TO_BE_CHECKED_OUT },
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.OPEN_ITEM_ARRIVED], value: MEDIATED_REQUEST_STATUS.OPEN_ITEM_ARRIVED },
  { label: MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[MEDIATED_REQUEST_STATUS.OPEN_NOT_YET_FILLED], value: MEDIATED_REQUEST_STATUS.OPEN_NOT_YET_FILLED },
];

export const MEDIATED_REQUEST_STATUS_PROP_TYPES = {
  [MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS]: PropTypes.arrayOf(PropTypes.oneOf({
    [MEDIATED_REQUEST_STATUS.CLOSED_CANCELLED]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.CLOSED_DECLINED]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.CLOSED_FILLED]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_AWAITING_DELIVERY]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_AWAITING_PICKUP]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT_FOR_APPROVAL]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT_TO_BE_CHECKED_OUT]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_ITEM_ARRIVED]: PropTypes.string,
    [MEDIATED_REQUEST_STATUS.OPEN_NOT_YET_FILLED]: PropTypes.string,
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
  [MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS]: PropTypes.oneOf(PropTypes.shape({
    [MEDIATED_REQUEST_LEVEL.TITLE]: PropTypes.string,
    [MEDIATED_REQUEST_LEVEL.ITEM]: PropTypes.string,
  })),
};

export const RESOURCE_TYPES = {
  ITEM: 'item',
  INSTANCE: 'instance',
  USER: 'user',
  LOAN: 'loan',
  REQUEST_TYPES: 'requestTypes',
  REQUEST_PREFERENCES: 'requestPreferences',
  REQUEST_BY_ID: 'requestById',
};

export const RESOURCE_KEYS = {
  ID: 'id',
  BARCODE: 'barcode',
};

export const REQUEST_PARAMS = {
  HRID: 'hrid',
  ID: 'id',
};

export const ITEM_QUERIES = {
  [RESOURCE_KEYS.ID]: 'item.id',
  [RESOURCE_KEYS.BARCODE]: 'items.barcode',
};

export const ID_TYPE_MAP = {
  ITEM_ID: 'itemId',
  INSTANCE_ID: 'instanceId',
};

export const MEDIATED_REQUEST_FORM_FIELD_NAMES = {
  CREATE_TLR: 'createTitleLevelRequest',
  REQUESTER: 'requester',
  REQUESTER_ID: 'requesterId',
  REQUESTER_BARCODE: 'requester.barcode',
  PATRON_COMMENTS: 'patronComments',
  PROXY_USER_ID: 'proxyUserId',
  ITEM_ID: 'itemId',
  ITEM_BARCODE: 'item.barcode',
  INSTANCE_ID: 'instanceId',
  INSTANCE_HRID: 'instance.hrid',
  DELIVERY_ADDRESS_TYPE_ID: 'deliveryAddressTypeId',
  PICKUP_SERVICE_POINT_ID: 'pickupServicePointId',
  REQUEST_TYPE: 'requestType',
  FULFILLMENT_PREFERENCE: 'fulfillmentPreference',
  KEY_OF_ITEM_BARCODE_FIELD: 'keyOfItemBarcodeField',
  KEY_OF_INSTANCE_ID_FIELD: 'keyOfInstanceIdField',
  KEY_OF_USER_BARCODE_FIELD: 'keyOfUserBarcodeField',
  KEY_OF_REQUEST_TYPE_FIELD: 'keyOfRequestTypeField',
};

export const EMPTY_MEDIATED_REQUEST_FORM_VALUE = undefined;
export const EMPTY_RESOURCE_VALUE = null;

export const MEDIATED_REQUEST_OPERATIONS = {
  CREATE: 'create',
};

export const MEDIATED_REQUEST_TYPES = {
  RECALL: 'Recall',
  HOLD: 'Hold',
  PAGE: 'Page',
};

export const MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS = {
  [MEDIATED_REQUEST_TYPES.RECALL]: 'ui-requests-mediated.form.request.type.recall',
  [MEDIATED_REQUEST_TYPES.HOLD]: 'ui-requests-mediated.form.request.type.hold',
  [MEDIATED_REQUEST_TYPES.PAGE]: 'ui-requests-mediated.form.request.type.page',
};

export const DEFAULT_REQUEST_TYPE_VALUE = '';

export const SAVE_BUTTON_ID = 'saveRequestButton';
export const CONFIRM_BUTTON_ID = 'confirmRequestButton';

export const FULFILMENT_TYPES = {
  DELIVERY: 'Delivery',
  HOLD_SHELF: 'Hold Shelf',
};

export const FULFILMENT_TYPES_TRANSLATION_KEYS = {
  [FULFILMENT_TYPES.DELIVERY]: 'ui-requests-mediated.form.request.fulfillment.delivery',
  [FULFILMENT_TYPES.HOLD_SHELF]: 'ui-requests-mediated.form.request.fulfillment.holdShelf',
};

export const FULFILMENT_TYPES_MAP = [
  {
    id: FULFILMENT_TYPES.HOLD_SHELF,
    label: FULFILMENT_TYPES_TRANSLATION_KEYS[FULFILMENT_TYPES.HOLD_SHELF],
  },
  {
    id: FULFILMENT_TYPES.DELIVERY,
    label: FULFILMENT_TYPES_TRANSLATION_KEYS[FULFILMENT_TYPES.DELIVERY],
  },
];

export const ITEM_STATUSES = {
  AVAILABLE: 'Available',
  AGED_TO_LOST: 'Aged to lost',
  AWAITING_DELIVERY: 'Awaiting delivery',
  AWAITING_PICKUP: 'Awaiting pickup',
  CHECKED_OUT: 'Checked out',
  CLAIMED_RETURNED: 'Claimed returned',
  DECLARED_LOST: 'Declared lost',
  IN_PROCESS: 'In process',
  IN_PROCESS_NON_REQUESTABLE: 'In process (non-requestable)',
  IN_TRANSIT: 'In transit',
  INTELLECTUAL_ITEM: 'Intellectual item',
  LONG_MISSING: 'Long missing',
  LOST_AND_PAID: 'Lost and paid',
  MISSING: 'Missing',
  ON_ORDER: 'On order',
  PAGED: 'Paged',
  UNAVAILABLE: 'Unavailable',
  UNKNOWN: 'Unknown',
  WITHDRAWN: 'Withdrawn',
  RECENTLY_RETURNED: 'Recently returned',
  AVAILABLE_IN_ASR: 'Available in ASR',
  RETRIEVING_FROM_ASR: 'Retrieving from ASR',
  MISSING_FROM_ASR: 'Missing from ASR',
  ORDER_CLOSED: 'Order closed',
  RESTRICTED: 'Restricted',
};

export const ITEM_STATUS_TRANSLATION_KEYS = {
  [ITEM_STATUSES.AVAILABLE]: 'ui-requests-mediated.item.status.available',
  [ITEM_STATUSES.AGED_TO_LOST]: 'ui-requests-mediated.item.status.agedToLost',
  [ITEM_STATUSES.AWAITING_DELIVERY]: 'ui-requests-mediated.item.status.awaitingDelivery',
  [ITEM_STATUSES.AWAITING_PICKUP]: 'ui-requests-mediated.item.status.awaitingPickup',
  [ITEM_STATUSES.CHECKED_OUT]: 'ui-requests-mediated.item.status.checkedOut',
  [ITEM_STATUSES.CLAIMED_RETURNED]: 'ui-requests-mediated.item.status.claimedReturned',
  [ITEM_STATUSES.DECLARED_LOST]: 'ui-requests-mediated.item.status.declaredLost',
  [ITEM_STATUSES.IN_PROCESS]: 'ui-requests-mediated.item.status.inProcess',
  [ITEM_STATUSES.IN_PROCESS_NON_REQUESTABLE]: 'ui-requests-mediated.item.status.inProcessNonRequestable',
  [ITEM_STATUSES.IN_TRANSIT]: 'ui-requests-mediated.item.status.inTransit',
  [ITEM_STATUSES.INTELLECTUAL_ITEM]: 'ui-requests-mediated.item.status.intellectualItem',
  [ITEM_STATUSES.LONG_MISSING]: 'ui-requests-mediated.item.status.longMissing',
  [ITEM_STATUSES.LOST_AND_PAID]: 'ui-requests-mediated.item.status.lostAndPaid',
  [ITEM_STATUSES.MISSING]: 'ui-requests-mediated.item.status.missing',
  [ITEM_STATUSES.ON_ORDER]: 'ui-requests-mediated.item.status.onOrder',
  [ITEM_STATUSES.PAGED]: 'ui-requests-mediated.item.status.paged',
  [ITEM_STATUSES.UNAVAILABLE]: 'ui-requests-mediated.item.status.unavailable',
  [ITEM_STATUSES.UNKNOWN]: 'ui-requests-mediated.item.status.unknown',
  [ITEM_STATUSES.WITHDRAWN]: 'ui-requests-mediated.item.status.withdrawn',
  [ITEM_STATUSES.RECENTLY_RETURNED]: 'ui-requests-mediated.item.status.recentlyReturned',
  [ITEM_STATUSES.AVAILABLE_IN_ASR]: 'ui-requests-mediated.item.status.availableInASR',
  [ITEM_STATUSES.RETRIEVING_FROM_ASR]: 'ui-requests-mediated.item.status.retrievingFromASR',
  [ITEM_STATUSES.MISSING_FROM_ASR]: 'ui-requests-mediated.item.status.missingFromASR',
  [ITEM_STATUSES.ORDER_CLOSED]: 'ui-requests-mediated.item.status.orderClosed',
  [ITEM_STATUSES.RESTRICTED]: 'ui-requests-mediated.item.status.restricted',
};

export const STAFF_NOTES_DOMAIN_NAME = 'requests-mediated';
export const STAFF_NOTES_ENTITY_TYPE = 'request-mediated';

export const FILTER_CONFIG = [
  {
    name: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS,
    cql: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS,
    values: [],
    operator: '==',
  },
  {
    name: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS,
    cql: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS,
    values: [],
    operator: '==',
  },
];

export const SEARCH_FIELDS = [
  MEDIATED_REQUEST_SEARCH_PARAMS.INSTANCE_TITLE,
  MEDIATED_REQUEST_SEARCH_PARAMS.ITEM_BARCODE,
  MEDIATED_REQUEST_SEARCH_PARAMS.REQUESTER_BARCODE,
  MEDIATED_REQUEST_SEARCH_PARAMS.CALL_NUMBER,
  MEDIATED_REQUEST_SEARCH_PARAMS.FULL_CALL_NUMBER,
];

export const REPORT_HEADERS = [
  'requestType',
  'status',
  'requestDate',
  'item.barcode',
  'instance.title',
  'instance.contributorNames',
  'item.location.libraryName',
  'item.callNumberComponents.prefix',
  'item.callNumberComponents.callNumber',
  'item.callNumberComponents.suffix',
  'item.volume',
  'item.enumeration',
  'item.chronology',
  'item.copyNumber',
  'requester.name',
  'requester.barcode',
  'requester.patronGroup.group',
  'fulfillmentPreference',
  'pickupServicePoint.name',
  'deliveryAddress',
  'patronComments',
];

export const IS_PROXY_AVAILABLE = false;
