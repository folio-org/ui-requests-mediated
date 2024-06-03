export const APP_ICON_NAME = 'requests-mediated';
export const MODULE_ROUTE = 'requests-mediated';

export const FILTER_PANE_WIDTH = '320px';

export const REQUEST_LEVEL_TYPES = {
  ITEM: 'Item',
  TITLE: 'Title',
};

export const RESOURCE_TYPES = {
  ITEM: 'item',
  INSTANCE: 'instance',
  USER: 'user',
  HOLDING: 'holding',
  REQUEST_TYPES: 'requestTypes',
};

export const ICON_TYPES = {
  TIMES: 'times',
};

export const RESOURCE_KEYS = {
  ID: 'id',
  BARCODE: 'barcode',
};

export const REQUEST_FORM_FIELD_NAMES = {
  CREATE_TLR: 'createTitleLevelRequest',
  FULFILLMENT_PREFERENCE: 'fulfillmentPreference',
  DELIVERY_ADDRESS_TYPE_ID: 'deliveryAddressTypeId',
  REQUESTER_ID: 'requesterId',
  REQUESTER: 'requester',
  PROXY_USER_ID: 'proxyUserId',
  PICKUP_SERVICE_POINT_ID: 'pickupServicePointId',
  ITEM_ID: 'itemId',
  ITEM_BARCODE: 'item.barcode',
  REQUEST_TYPE: 'requestType',
  INSTANCE_ID: 'instanceId',
  INSTANCE_HRID: 'instance.hrid',
  REQUESTER_BARCODE: 'requester.barcode',
};

export const DEFAULT_REQUEST_TYPE_VALUE = '';

export const REQUEST_LAYERS = {
  EDIT: 'edit',
  DUPLICATE: 'duplicate',
};

export const REQUEST_OPERATIONS = {
  CREATE: 'create',
  REPLACE: 'replace',
};

export const ID_TYPE_MAP = {
  ITEM_ID: 'itemId',
  INSTANCE_ID: 'instanceId',
};

export const DCB_INSTANCE_ID = '9d1b77e4-f02e-4b7f-b296-3f2042ddac54';
export const DCB_HOLDINGS_RECORD_ID = '10cd3a5a-d36f-4c7a-bc4f-e1ae3cf820c9';
export const INVALID_REQUEST_HARDCODED_ID = '00000000-0000-4000-8000-000000000000';

// used to perform queries with the backend
// not used for data display
export const REQUEST_STATUSES = {
  AWAITING_DELIVERY: 'Open - Awaiting delivery',
  AWAITING_PICKUP: 'Open - Awaiting pickup',
  CANCELLED: 'Closed - Cancelled',
  CHECKED_OUT: 'Checked out',
  FILLED: 'Closed - Filled',
  HOLD: 'Hold',
  IN_TRANSIT: 'Open - In transit',
  NOT_YET_FILLED: 'Open - Not yet filled',
  PICKUP_EXPIRED: 'Closed - Pickup expired',
  RECALL: 'Recall',
  UNFILLED: 'Closed - Unfilled',
};

export const OPEN_REQUEST_STATUS_FILTERS = [
  REQUEST_STATUSES.NOT_YET_FILLED,
  REQUEST_STATUSES.AWAITING_PICKUP,
  REQUEST_STATUSES.AWAITING_DELIVERY,
  REQUEST_STATUSES.IN_TRANSIT,
]
  .map(status => `requestStatus.${status}`)
  .join(',');

export const ITEM_STATUSES = {
  AGED_TO_LOST: 'Aged to lost',
  AVAILABLE: 'Available',
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
  [ITEM_STATUSES.AGED_TO_LOST]: 'ui-requests-mediated.item.status.agedToLost',
  [ITEM_STATUSES.AVAILABLE]: 'ui-requests-mediated.item.status.available',
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
  icon: 'spinner-ellipsis',
  width: '10px',
};

export const ITEM_QUERIES = {
  [RESOURCE_KEYS.ID]: 'item.id',
  [RESOURCE_KEYS.BARCODE]: 'items.barcode',
};