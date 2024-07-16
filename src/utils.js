import {
  get,
  includes,
  isObject,
  keyBy,
  sortBy,
} from 'lodash';

import {
  DEFAULT_VIEW_VALUE,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME,
  MEDIATED_REQUESTS_RECORD_FIELD_PATH,
  FULFILMENT_TYPES,
  REQUEST_TYPE_TRANSLATIONS,
  ID_TYPE_MAP,
  REQUEST_LEVEL_TYPES,
  REQUEST_TYPE_ERROR_TRANSLATIONS,
  REQUEST_TYPE_ERRORS,
} from './constants';

export const transformRequestFilterOptions = (formatMessage, source = []) => (
  source.map(({ label, value }) => ({
    label: formatMessage({ id: label }),
    value,
  }))
);

export const getIsTitleLevelRequestsFeatureEnabled = (data) => (
  data?.items[0]?.value?.titleLevelRequestsFeatureEnabled || false
);

export const handleKeyCommand = (handler, { disabled } = {}) => {
  return (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!disabled) {
      handler();
    }
  };
};

export const isFormEditing = (request) => {
  return !!get(request, 'id');
};

export const memoizeValidation = (fn) => {
  const lastArgs = {};
  const lastKeys = {};
  const lastResults = {};

  return (fieldName, key) => arg => {
    const lastArg = lastArgs[fieldName];
    const lastKey = lastKeys[fieldName];

    if (
      arg !== lastArg ||
      (key !== lastKey && arg === lastArg)
    ) {
      lastArgs[fieldName] = arg;
      lastKeys[fieldName] = key;
      lastResults[fieldName] = fn(arg);
    }

    return lastResults[fieldName];
  };
};

export const getInstanceQueryString = (hrid, id) => `("hrid"=="${hrid}" or "id"=="${id || hrid}")`;

export const getStatusQuery = (statuses = []) => statuses.reduce((acc, val) => `${acc ? acc + ' or ' : acc}status=="${val}"`, '');

export const getTlrSettings = (settings) => settings || {};

export const getPatronGroup = (patron, patronGroups) => {
  const patronGroup = get(patron, 'patronGroup');

  if (!patronGroup || !patronGroups.length) {
    return;
  }

  const id = isObject(patronGroup) ? patronGroup.id : patronGroup;

  // eslint-disable-next-line consistent-return
  return patronGroups.find(group => group.id === id);
};

export const isSubmittingButtonDisabled = (pristine, submitting) => pristine || submitting;

const isYear = (value) => {
  const YEAR_REGEX = /^([1-9]\d{0,3})$/;

  return YEAR_REGEX.test(value);
};

export const getFormattedYears = (publications, limit) => {
  const years = publications
    ?.map(({ dateOfPublication }) => dateOfPublication)
    .filter((year) => isYear(year));

  return years?.length
    ? years
      .map((year) => parseInt(year, 10))
      .sort((a, b) => b - a)
      .slice(0, limit)
      .join(', ')
    : '';
};

export const getFullName = (user) => {
  const userNameObj = user?.personal || user;
  const lastName = get(userNameObj, ['lastName'], '');
  const firstName = get(userNameObj, ['firstName'], '');
  const middleName = get(userNameObj, ['middleName'], '');
  const preferredFirstName = get(userNameObj, ['preferredFirstName'], '');
  const displayedFirstName = preferredFirstName || firstName;

  return `${lastName}${displayedFirstName ? ', ' : ''}${displayedFirstName} ${middleName}`;
};

export const getRequesterName = (mediatedRequest) => {
  const lastName = get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_LAST_NAME], DEFAULT_VIEW_VALUE);
  const firstName = get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_FIRST_NAME], DEFAULT_VIEW_VALUE);
  const middleName = get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_MIDDLE_NAME], DEFAULT_VIEW_VALUE);
  const preferredFirstName = get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.PREFERRED_FIRST_NAME], DEFAULT_VIEW_VALUE);
  const displayedFirstName = preferredFirstName || firstName;
  let requesterName = lastName;

  if (displayedFirstName || middleName) {
    requesterName = requesterName.concat(', ');
  }

  if (displayedFirstName) {
    requesterName = requesterName.concat(displayedFirstName);
  }

  if (middleName) {
    requesterName = requesterName.concat(' ', middleName);
  }

  return requesterName;
};

export const resetFieldState = (form, fieldName) => {
  const registeredFields = form.getRegisteredFields();

  if (includes(registeredFields, fieldName)) {
    form.resetFieldState(fieldName);
  }
};

export const getSelectedAddressTypeId = (deliverySelected, defaultDeliveryAddressTypeId) => {
  return deliverySelected ? defaultDeliveryAddressTypeId : DEFAULT_VIEW_VALUE;
};

export const isDeliverySelected = (fulfillmentPreference) => {
  return fulfillmentPreference === FULFILMENT_TYPES.DELIVERY;
};

export const getFulfillmentTypeOptions = (hasDelivery, fulfillmentTypes) => {
  const sortedFulfillmentTypes = sortBy(fulfillmentTypes, ['label']);
  const fulfillmentTypeOptions = sortedFulfillmentTypes.map(({
    label,
    id,
  }) => ({
    label,
    value: id,
  }));

  return hasDelivery
    ? fulfillmentTypeOptions
    : fulfillmentTypeOptions.filter(option => option.value !== FULFILMENT_TYPES.DELIVERY);
};

export const getRequestTypesOptions = (requestTypes) => {
  return Object.keys(requestTypes).map(requestType => {
    return {
      id: REQUEST_TYPE_TRANSLATIONS[requestType],
      value: requestType,
    };
  });
};

export const getDeliveryInformation = (selectedUser, addressTypes) => {
  let deliveryLocations;
  let deliveryLocationsDetail = [];

  if (selectedUser?.personal?.addresses && addressTypes) {
    deliveryLocations = selectedUser.personal.addresses.map((address) => {
      const label = addressTypes.addressTypes.find(({ id }) => id === address.addressTypeId).addressType;

      return {
        label,
        value: address.addressTypeId,
      };
    });
    deliveryLocations = sortBy(deliveryLocations, ['label']);
    deliveryLocationsDetail = keyBy(selectedUser.personal.addresses, address => address.addressTypeId);
  }

  return {
    deliveryLocations,
    deliveryLocationsDetail,
  };
};

export const getDefaultRequestPreferences = (initialValues) => {
  return {
    hasDelivery: false,
    defaultDeliveryAddressTypeId: DEFAULT_VIEW_VALUE,
    defaultServicePointId: DEFAULT_VIEW_VALUE,
    deliverySelected: isDeliverySelected(initialValues?.fulfillmentPreference),
    selectedAddressTypeId: DEFAULT_VIEW_VALUE,
  };
};

export const getFulfillmentPreference = (preferences, initialValues) => {
  return get(preferences, 'fulfillment') || get(initialValues, 'fulfillmentPreference', FULFILMENT_TYPES.HOLD_SHELF);
};

export const getRequestLevelValue = (value) => {
  return value
    ? REQUEST_LEVEL_TYPES.TITLE
    : REQUEST_LEVEL_TYPES.ITEM;
};

export const getResourceTypeId = (isTitleLevelRequest) => (isTitleLevelRequest ? ID_TYPE_MAP.INSTANCE_ID : ID_TYPE_MAP.ITEM_ID);

export const getRequestInformation = (values, selectedInstance, selectedItem) => {
  const selectedResource = values.createTitleLevelRequest ? selectedInstance : selectedItem;

  return {
    isTitleLevelRequest: values.createTitleLevelRequest,
    selectedResource,
  };
};

export const getNoRequestTypeErrorMessageId = (isTitleLevelRequest) => (
  isTitleLevelRequest ?
    REQUEST_TYPE_ERROR_TRANSLATIONS[REQUEST_TYPE_ERRORS.TITLE_LEVEL_ERROR] :
    REQUEST_TYPE_ERROR_TRANSLATIONS[REQUEST_TYPE_ERRORS.ITEM_LEVEL_ERROR]
);
