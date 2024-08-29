import {
  get,
  includes,
  isObject,
  keyBy,
  sortBy,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { NoValue } from '@folio/stripes/components';

import AddressDetails from './components/MediatedRequestsActivities/components/AddressDetails';
import {
  DEFAULT_VIEW_VALUE,
  FULFILMENT_TYPES,
  MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS,
  ID_TYPE_MAP,
  MEDIATED_REQUEST_LEVEL,
  MEDIATED_REQUEST_TYPE_ERROR_TRANSLATIONS,
  MEDIATED_REQUEST_TYPE_ERROR_LEVEL,
  REQUEST_PARAMS,
  USER_NAMES,
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

export const getInstanceQueryString = (hrid, id) => `("${REQUEST_PARAMS.HRID}"=="${hrid}" or "${REQUEST_PARAMS.ID}"=="${id || hrid}")`;

export const getTlrSettings = (settings) => settings || {};

export const getPatronGroup = (patron, patronGroups) => {
  const patronGroup = get(patron, 'patronGroup');

  if (!patronGroups?.length) {
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

export const getRequesterName = (dataObject) => {
  const requester = dataObject?.requester ? dataObject.requester : dataObject?.personal || dataObject;
  const lastName = get(requester, USER_NAMES.USER_LAST_NAME, DEFAULT_VIEW_VALUE);
  const firstName = get(requester, USER_NAMES.USER_FIRST_NAME, DEFAULT_VIEW_VALUE);
  const middleName = get(requester, USER_NAMES.USER_MIDDLE_NAME, DEFAULT_VIEW_VALUE);
  const preferredFirstName = get(requester, USER_NAMES.PREFERRED_FIRST_NAME, DEFAULT_VIEW_VALUE);
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

export const getTotalCount = (source) => (
  source ? source.totalCount() : 0
);

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
  const sortParam = 'label';
  const sortedFulfillmentTypes = sortBy(fulfillmentTypes, [sortParam]);
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
      id: MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS[requestType],
      value: requestType,
    };
  });
};

export const getDeliveryInformation = (selectedUser, addressTypes) => {
  let deliveryLocations;
  let deliveryLocationsDetail = {};

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
    ? MEDIATED_REQUEST_LEVEL.TITLE
    : MEDIATED_REQUEST_LEVEL.ITEM;
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
    MEDIATED_REQUEST_TYPE_ERROR_TRANSLATIONS[MEDIATED_REQUEST_TYPE_ERROR_LEVEL.TITLE_LEVEL_ERROR] :
    MEDIATED_REQUEST_TYPE_ERROR_TRANSLATIONS[MEDIATED_REQUEST_TYPE_ERROR_LEVEL.ITEM_LEVEL_ERROR]
);

export const validateDropDownValue = (shouldValidate) => (value) => {
  if (shouldValidate) {
    return value ? undefined : <FormattedMessage id="ui-requests-mediated.form.errors.requiredToConfirm" />;
  }

  return undefined;
};

export const getUserPreferences = (mediatedRequest, userData, servicePoints) => {
  const userPreferences = {};

  if (mediatedRequest) {
    if (isDeliverySelected(mediatedRequest.fulfillmentPreference)) {
      const address = userData?.users[0].personal.addresses.find(({ addressTypeId }) => addressTypeId === mediatedRequest.deliveryAddressTypeId);

      userPreferences.label = <FormattedMessage id="ui-requests-mediated.requesterDetails.deliveryAddress" />;
      userPreferences.value = <AddressDetails address={address} />;
    } else {
      userPreferences.label = <FormattedMessage id="ui-requests-mediated.requesterDetails.pickupServicePoint" />;
      userPreferences.value = servicePoints?.servicepoints.find(servicePoint => servicePoint.id === mediatedRequest.pickupServicePointId)?.name;
    }
  }

  return userPreferences;
};

export const getReferredRecordData = (mediatedRequest) => {
  if (mediatedRequest) {
    return {
      instanceTitle: mediatedRequest.instance.title,
      instanceId: mediatedRequest.instanceId,
      itemBarcode: mediatedRequest?.item?.barcode,
      itemId: mediatedRequest.itemId,
      holdingsRecordId: mediatedRequest.holdingsRecordId,
      requesterName: getRequesterName(mediatedRequest.requester),
      requesterId: mediatedRequest.requester.id ?? mediatedRequest?.requesterId,
      requestCreateDate: mediatedRequest?.metadata.createdDate,
    };
  }

  return {};
};

export const formatNoteReferrerEntityData = (entityData) => {
  if (entityData) {
    const {
      entityName: name,
      entityType: type,
      entityId: id,
    } = entityData;

    return {
      name,
      type,
      id,
    };
  }

  return false;
};

export const getUserHighlightBoxLink = (linkText, id) => {
  return linkText ? <Link to={`/users/view/${id}`}>{linkText}</Link> : <></>;
};

export const getProxyInformation = (proxy, proxyIdFromRequest) => {
  if (proxy) {
    return {
      name: getRequesterName(proxy),
      barcode: proxy.barcode || <NoValue />,
      id: proxy.id || proxyIdFromRequest,
    };
  }

  return {};
};

export const getRequester = (proxy, selectedUser) => proxy || selectedUser;
