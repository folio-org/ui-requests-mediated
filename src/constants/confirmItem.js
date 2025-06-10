import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';

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

export const CONTENT_DATA_PROP_TYPES = PropTypes.arrayOf(PropTypes.shape({
  arrivalDate: PropTypes.string,
  transitDate: PropTypes.string,
  instance: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
  item: PropTypes.arrayOf(PropTypes.shape({
    barcode: PropTypes.string,
  })),
  requester: PropTypes.arrayOf(PropTypes.shape({
    barcode: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    middleName: PropTypes.string,
    preferredFirstName: PropTypes.string,
  })),
  mediatedRequest: PropTypes.arrayOf(PropTypes.shape({
    status: PropTypes.string,
  })),
  searchIndex: PropTypes.arrayOf(PropTypes.shape({
    callNumberComponents: PropTypes.arrayOf(PropTypes.shape({
      callNumber: PropTypes.string,
    })),
  })),
}));

export const REQUEST_PROP_TYPES = PropTypes.shape({
  requestLevel: PropTypes.string,
  itemId: PropTypes.string,
  requesterId: PropTypes.string,
  patronComments: PropTypes.string,
  proxyUserId: PropTypes.string,
  requestType: PropTypes.string,
  proxy: PropTypes.string,
  fulfillmentPreference: PropTypes.string,
  pickupServicePointId: PropTypes.string,
  instance: PropTypes.shape({
    hrid: PropTypes.string,
  }),
  item: PropTypes.shape({
    barcode: PropTypes.string,
  }),
  requester: PropTypes.shape({
    barcode: PropTypes.string,
  }),
});

export const SLIP_DATA_PROP_TYPES = PropTypes.shape({
  currentDateTime: PropTypes.string,
  staffSlip: PropTypes.shape({
    Name: PropTypes.string,
    currentDateTime: PropTypes.string,
    staffUsername: PropTypes.string,
  }),
  item: PropTypes.shape({
    title: PropTypes.string,
    primaryContributor: PropTypes.string,
    allContributors: PropTypes.string,
    barcode: PropTypes.string,
    barcodeImage: PropTypes.string,
    callNumber: PropTypes.string,
    callNumberPrefix: PropTypes.string,
    callNumberSuffix: PropTypes.string,
    displaySummary: PropTypes.string,
    enumeration: PropTypes.string,
    volume: PropTypes.string,
    chronology: PropTypes.string,
    copy: PropTypes.string,
    yearCaption: PropTypes.string,
    materialType: PropTypes.string,
    loanType: PropTypes.string,
    numberOfPieces: PropTypes.string,
    descriptionOfPieces: PropTypes.string,
    lastCheckedInDateTime: PropTypes.string,
    fromServicePoint: PropTypes.string,
    toServicePoint: PropTypes.string,
    effectiveLocationInstitution: PropTypes.string,
    effectiveLocationCampus: PropTypes.string,
    effectiveLocationLibrary: PropTypes.string,
    effectiveLocationSpecific: PropTypes.string,
    effectiveLocationPrimaryServicePointName: PropTypes.string,
    accessionNumber: PropTypes.string,
    administrativeNotes: PropTypes.string,
    datesOfPublication: PropTypes.string,
    editions: PropTypes.string,
    physicalDescriptions: PropTypes.string,
    instanceHrid: PropTypes.string,
    instanceHridImage: PropTypes.string,
  }),
  requester: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    middleName: PropTypes.string,
    preferredFirstName: PropTypes.string,
    patronGroup: PropTypes.string,
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
    stateProvRegion: PropTypes.string,
    zipPostalCode: PropTypes.string,
    barcode: PropTypes.string,
    barcodeImage: PropTypes.string,
    departments: PropTypes.string,
  }),
  request: PropTypes.shape({
    servicePointPickup: PropTypes.string,
    deliveryAddressType: PropTypes.string,
    requestExpirationDate: PropTypes.string,
    requestDate: PropTypes.string,
    holdShelfExpirationDate: PropTypes.string,
    requestID: PropTypes.string,
    patronComments: PropTypes.string,
    barcodeImage: PropTypes.string,
  }),
}).isRequired;
