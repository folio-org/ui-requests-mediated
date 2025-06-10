import {
  FormattedMessage,
} from 'react-intl';

import {
  USER_NAMES,
} from './mediatedRequestsActivities';

export const CONFIRM_ITEM_TYPES = {
  CONFIRM_ITEM_ARRIVAL: 'confirmItemArrival',
  SEND_ITEM_IN_TRANSIT: 'sendItemInTransit',
};

export const CONFIRM_ITEM_RECORD_FIELD_NAME = {
  DATE: 'date',
  ARRIVAL_DATE: 'arrivalDate',
  IN_TRANSIT_DATE: 'inTransitDate',
  TITLE: 'instanceTitle',
  ITEM_BARCODE: 'itemBarcode',
  ITEM: 'item',
  EFFECTIVE_CALL_NUMBER: 'shelvingOrder',
  MEDIATED_REQUEST_STATUS: 'mediatedRequestStatus',
  REQUESTER: 'requester',
  USER_FIRST_NAME: 'requesterFirstName',
  USER_LAST_NAME: 'requesterLastName',
  USER_MIDDLE_NAME: 'middleName',
  PREFERRED_FIRST_NAME: 'preferredFirstName',
  REQUESTER_BARCODE: 'requesterBarcode',
};

export const CONFIRM_ITEM_RECORD_FIELD_PATH = {
  [CONFIRM_ITEM_RECORD_FIELD_NAME.ARRIVAL_DATE]: 'arrivalDate',
  [CONFIRM_ITEM_RECORD_FIELD_NAME.IN_TRANSIT_DATE]: 'inTransitDate',
  [CONFIRM_ITEM_RECORD_FIELD_NAME.TITLE]: 'instance.title',
  [CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM_BARCODE]: 'item.barcode',
  [CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM]: 'item',
  [CONFIRM_ITEM_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: 'searchIndex.callNumberComponents.callNumber',
  [CONFIRM_ITEM_RECORD_FIELD_NAME.MEDIATED_REQUEST_STATUS]: 'mediatedRequest.status',
  [CONFIRM_ITEM_RECORD_FIELD_NAME.USER_FIRST_NAME]: `requester.${USER_NAMES.USER_FIRST_NAME}`,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.USER_LAST_NAME]: `requester.${USER_NAMES.USER_LAST_NAME}`,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.USER_MIDDLE_NAME]: `requester.${USER_NAMES.USER_MIDDLE_NAME}`,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.PREFERRED_FIRST_NAME]: `requester.${USER_NAMES.PREFERRED_FIRST_NAME}`,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER_BARCODE]: 'requester.barcode',
};

export const CONFIRM_ITEM_RECORD_TRANSLATIONS = {
  [CONFIRM_ITEM_RECORD_FIELD_NAME.ARRIVAL_DATE]: <FormattedMessage id="ui-requests-mediated.confirmItemList.columnName.arrivalDate" />,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.IN_TRANSIT_DATE]: <FormattedMessage id="ui-requests-mediated.confirmItemList.columnName.inTransitDate" />,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.TITLE]: <FormattedMessage id="ui-requests-mediated.confirmItemList.columnName.title" />,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM_BARCODE]: <FormattedMessage id="ui-requests-mediated.confirmItemList.columnName.itemBarcode" />,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: <FormattedMessage id="ui-requests-mediated.confirmItemList.columnName.effectiveCallNumber" />,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.MEDIATED_REQUEST_STATUS]: <FormattedMessage id="ui-requests-mediated.confirmItemList.columnName.mediatedRequestStatus" />,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER]: <FormattedMessage id="ui-requests-mediated.confirmItemList.columnName.requester" />,
  [CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER_BARCODE]: <FormattedMessage id="ui-requests-mediated.confirmItemList.columnName.requesterBarcode" />,
};
