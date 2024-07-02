export const APP_ICON_NAME = 'requests-mediated';
export const MODULE_ROUTE = 'requests-mediated';

export const PAGE_AMOUNT = 100;
export const FILTER_PANE_WIDTH = '22%';

export const DEFAULT_VIEW_VALUE = '';

export const ICONS = {
  TIMES_CIRCLE_SOLID: 'times-circle-solid',
};

export const REQUEST_LEVEL_TYPES = {
  ITEM: 'Item',
  TITLE: 'Title',
};

export const RESOURCE_TYPES = {
  ITEM: 'item',
  INSTANCE: 'instance',
  USER: 'user',
  LOAN: 'loan',
  REQUESTS_FOR_ITEM: 'requestsForItem',
  REQUESTS_FOR_INSTANCE: 'requestsForInstance',
};

export const ICON_TYPES = {
  TIMES: 'times',
  SPINNER: 'spinner-ellipsis',
};

export const RESOURCE_KEYS = {
  ID: 'id',
  BARCODE: 'barcode',
};

export const REQUEST_FORM_FIELD_NAMES = {
  CREATE_TLR: 'createTitleLevelRequest',
  REQUESTER: 'requester',
  REQUESTER_ID: 'requesterId',
  REQUESTER_BARCODE: 'requester.barcode',
  ITEM_ID: 'itemId',
  ITEM_BARCODE: 'item.barcode',
  INSTANCE_ID: 'instanceId',
  INSTANCE_HRID: 'instance.hrid',
  KEY_OF_ITEM_BARCODE_FIELD: 'keyOfItemBarcodeField',
  KEY_OF_INSTANCE_ID_FIELD: 'keyOfInstanceIdField',
  KEY_OF_USER_BARCODE_FIELD: 'keyOfUserBarcodeField',
};

export const REQUEST_STATUSES = {
  AWAITING_DELIVERY: 'Open - Awaiting delivery',
  AWAITING_PICKUP: 'Open - Awaiting pickup',
  IN_TRANSIT: 'Open - In transit',
  NOT_YET_FILLED: 'Open - Not yet filled',
};

export const OPEN_REQUESTS_STATUSES = [
  REQUEST_STATUSES.AWAITING_DELIVERY,
  REQUEST_STATUSES.AWAITING_PICKUP,
  REQUEST_STATUSES.IN_TRANSIT,
  REQUEST_STATUSES.NOT_YET_FILLED,
];

export const OPEN_REQUEST_STATUS_FILTERS = OPEN_REQUESTS_STATUSES
  .map(status => `requestStatus.${status}`)
  .join(',');

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

export const ITEM_STATUS_TRANSLATIONS = {
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

export const ENTER_EVENT_KEY = 'Enter';

export const BASE_SPINNER_PROPS = {
  icon: ICON_TYPES.SPINNER,
  width: '10px',
};

export const ITEM_QUERIES = {
  [RESOURCE_KEYS.ID]: 'item.id',
  [RESOURCE_KEYS.BARCODE]: 'items.barcode',
};

export const MAX_RECORDS = '10000';

export const DEFAULT_DISPLAYED_YEARS_AMOUNT = 3;

export const REQUEST_DATE_SORT_PARAM = 'Request Date';
