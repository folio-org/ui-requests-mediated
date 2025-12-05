import {
  get,
  includes,
  isObject,
  isFunction,
  keyBy,
  sortBy,
  escape,
} from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Barcode from 'react-barcode';

import { NoValue } from '@folio/stripes/components';

import AddressDetails from './components/MediatedRequestsActivities/components/AddressDetails';
import {
  DEFAULT_VIEW_VALUE,
  FULFILMENT_TYPES,
  MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS,
  ID_TYPE_MAP,
  MEDIATED_REQUEST_LEVEL,
  REQUEST_PARAMS,
  USER_NAMES,
  STAFF_SLIPS_TYPE,
  IS_PROXY_AVAILABLE,
} from './constants';

export const transformRequestFilterOptions = (formatMessage, source = []) => (
  source.map(({ label, value }) => ({
    label: formatMessage({ id: label }),
    value,
  }))
);

export const getIsTitleLevelRequestsFeatureEnabled = (data) => (
  data?.circulationSettings[0]?.value?.titleLevelRequestsFeatureEnabled || false
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

export const isDelivery = (fulfillmentPreference) => {
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
    isDeliverySelected: isDelivery(initialValues?.fulfillmentPreference),
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

export const getRequestInformation = (isTitleLevelRequest, selectedInstance, selectedItem) => {
  return isTitleLevelRequest ? selectedInstance : selectedItem;
};

export const getUserPreferences = (mediatedRequest, userData, servicePoints) => {
  const userPreferences = {};

  if (mediatedRequest) {
    if (isDelivery(mediatedRequest.fulfillmentPreference)) {
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

export const getUserHighlightBoxLink = (linkText, id, ariaLabel) => {
  const additionalProps = {
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
  };

  return linkText ?
    <Link
      {...additionalProps}
      to={`/users/view/${id}`}
    >
      {linkText}
    </Link> :
    <></>;
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

export const getFullNameForCsvRecords = (user) => {
  const {
    firstName = '',
    middleName = '',
    lastName = '',
  } = user;

  return [firstName, middleName, lastName].filter(Boolean).join(' ');
};

export const getDeliveryAddressForCsvRecords = (address) => {
  const {
    addressLine1 = '',
    city = '',
    region = '',
    postalCode = '',
    countryId = '',
  } = address;

  return [addressLine1, city, region, postalCode, countryId].filter(Boolean).join(' ');
};

export const isProxyFunctionalityAvailable = () => IS_PROXY_AVAILABLE;

export const modifyRecordsToExport = (records) => {
  return records.map(record => {
    const {
      instance,
      proxy,
      requester,
      deliveryAddress,
    } = record;

    if (instance.contributorNames?.length > 0) {
      instance.contributorNames = instance.contributorNames.map(({ name }) => name).join('; ');
    } else {
      instance.contributorNames = '';
    }

    if (isProxyFunctionalityAvailable() && proxy) {
      proxy.name = getFullNameForCsvRecords(proxy);
    }

    if (deliveryAddress) {
      record.deliveryAddress = getDeliveryAddressForCsvRecords(deliveryAddress);
    }

    requester.name = getFullNameForCsvRecords(requester);

    return record;
  });
};

export const handleConfirmItemSubmit = async (itemBarcode, confirmItemState, confirmItemProps) => {
  const {
    contentData,
    setContentData,
    setIsErrorModalOpen,
  } = confirmItemState;
  const {
    ky,
    url,
    onSuccess,
  } = confirmItemProps;

  await ky.post(url, {
    json: { itemBarcode },
  }).json()
    .then((resp) => {
      setContentData([resp].concat(contentData));

      if (isFunction(onSuccess)) {
        onSuccess(resp);
      }
    })
    .catch(() => {
      setIsErrorModalOpen(true);
    });
};

export const confirmDeclineModal = (declineModalState, declineModalProps) => {
  const {
    shouldUpdateMediatedRequestById,
    setShouldUpdateMediatedRequestById,
    setDeclineModalOpen,
  } = declineModalState;
  const {
    ky,
    url,
    updateMediatedRequestList,
  } = declineModalProps;

  ky.post(url)
    .then(() => {
      updateMediatedRequestList();
      setShouldUpdateMediatedRequestById(shouldUpdateMediatedRequestById + 1);
      setDeclineModalOpen(false);
    })
    .catch(() => {
      setDeclineModalOpen(false);
    });
};

export const getStaffSlipsTemplateByType = (staffSlips = [], slipType = STAFF_SLIPS_TYPE.TRANSIT_MEDIATED_REQUESTS) => {
  const slipTypeInLowerCase = slipType.toLowerCase();
  const slipTemplate = staffSlips.find(slip => slip.name.toLowerCase() === slipTypeInLowerCase);

  return get(slipTemplate, 'template', '');
};

export const escapeValue = (val) => {
  if (typeof val === 'string' && val.startsWith('<Barcode>') && val.endsWith('</Barcode>')) {
    return val;
  }

  return escape(val);
};

export const buildTemplate = (str) => {
  return o => {
    return str.replace(/{{([^{}]*)}}/g, (a, b) => {
      const r = o[b];

      return typeof r === 'string' || typeof r === 'number' ? escapeValue(r) : '';
    });
  };
};

export const shouldProcessNode = node => node.name === 'barcode';

export const processNode = (node, children) => (<Barcode value={children[0] ? children[0].trim() : ' '} />);
