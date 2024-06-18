export const MEDIATED_REQUEST_FILTER_TYPES = {
  MEDIATED_REQUEST_STATUS: 'mediatedRequestStatus',
  MEDIATED_REQUEST_LEVELS: 'mediatedRequestLevels',
};

export const MEDIATED_REQUEST_STATUS = {
  CLOSED_DECLINED: 'Closed - Declined',
  CLOSED_FILLED: 'Closed - Filled',
  NEW_AWAITING_CONFIRMATION: 'New - Awaiting confirmation',
  OPEN_AWAITING_PICKUP: 'Open - Awaiting pickup',
  OPEN_IN_PROGRESS: 'Open - In progress',
  OPEN_IN_TRANSIT: 'Open - In transit',
  OPEN_ITEM_ARRIVED: 'Open - Item arrived',
};

export const MEDIATED_REQUEST_STATUS_TRANSLATIONS = [
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.closedDeclined', value: MEDIATED_REQUEST_STATUS.CLOSED_DECLINED },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.closedFilled', value: MEDIATED_REQUEST_STATUS.CLOSED_FILLED },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.newAwaitingConfirmation', value: MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.openAwaitingPickup', value: MEDIATED_REQUEST_STATUS.OPEN_AWAITING_PICKUP },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.openInProgress', value: MEDIATED_REQUEST_STATUS.OPEN_IN_PROGRESS },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.openInTransit', value: MEDIATED_REQUEST_STATUS.OPEN_IN_TRANSIT },
  { label: 'ui-requests-mediated.filters.mediatedRequestStatus.openItemArrived', value: MEDIATED_REQUEST_STATUS.OPEN_ITEM_ARRIVED },
];

export const MEDIATED_REQUEST_LEVEL = {
  ITEM: 'Item',
  TITLE: 'Title',
};

export const MEDIATED_REQUEST_LEVEL_TRANSLATIONS = [
  { label: 'ui-requests-mediated.filters.mediatedRequestLevel.item', value: MEDIATED_REQUEST_LEVEL.ITEM },
  { label: 'ui-requests-mediated.filters.mediatedRequestLevel.title', value: MEDIATED_REQUEST_LEVEL.TITLE },
];
