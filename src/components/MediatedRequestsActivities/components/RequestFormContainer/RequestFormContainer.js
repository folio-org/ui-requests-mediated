import {
  useState,
  useRef,
} from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  cloneDeep,
  unset,
} from 'lodash';
import { stringify } from 'query-string';
import moment from 'moment-timezone';

import {
  useOkapiKy,
  useCallout,
} from '@folio/stripes/core';

import RequestForm from '../RequestForm';
import {
  getInstanceQueryString,
  getTlrSettings,
  getRequestLevelValue,
} from '../../../../utils';
import {
  ITEM_QUERIES,
  DEFAULT_REQUEST_TYPE_VALUE,
  FULFILMENT_TYPES,
  RESOURCE_TYPES,
  MEDIATED_REQUEST_LEVEL,
  SAVE_BUTTON_ID,
  getMediatedRequestsActivitiesUrl,
} from '../../../../constants';
import { useAddressTypes } from '../../../../hooks';

export const urls = {
  [RESOURCE_TYPES.USER]: (value, idType) => {
    const query = stringify({
      query: `(${idType}=="${value}")`,
    });

    return `users?${query}`;
  },
  [RESOURCE_TYPES.ITEM]: (value, idType) => {
    const query = stringify({
      query: `(${ITEM_QUERIES[idType]}=="${value}")`,
    });

    return `circulation-bff/requests/search-instances?${query}`;
  },
  [RESOURCE_TYPES.INSTANCE]: (value) => {
    const query = stringify({
      query: getInstanceQueryString(value),
    });

    return `circulation-bff/requests/search-instances?${query}`;
  },
  [RESOURCE_TYPES.LOAN]: (value) => {
    const query = stringify({
      query: `(itemId=="${value}") and status.name==Open`,
    });

    return `circulation/loans?${query}`;
  },
  [RESOURCE_TYPES.REQUEST_TYPES]: ({
    requesterId,
    itemId,
    instanceId,
    requestId,
    operation,
  }) => {
    const url = 'circulation-bff/requests/allowed-service-points';

    if (requestId) {
      return `${url}?operation=${operation}&requestId=${requestId}`;
    }

    let requestUrl = `${url}?requesterId=${requesterId}&operation=${operation}`;

    if (itemId) {
      requestUrl = `${requestUrl}&itemId=${itemId}`;
    } else if (instanceId) {
      requestUrl = `${requestUrl}&instanceId=${instanceId}`;
    }

    return requestUrl;
  },
  [RESOURCE_TYPES.REQUEST_PREFERENCES]: (value) => {
    const query = stringify({ query: `(userId=="${value}")` });

    return `request-preference-storage/request-preference?${query}`;
  },
  [RESOURCE_TYPES.REQUEST_BY_ID]: (id) => {
    return `requests-mediated/mediated-requests/${id}`;
  },
};

const RequestFormContainer = ({
  isEditMode,
  setRequest,
  request,
  settings,
  patronGroups,
}) => {
  const ky = useOkapiKy();
  const intl = useIntl();
  const history = useHistory();
  const callout = useCallout();
  const { addressTypes } = useAddressTypes();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProxy, setSelectedProxy] = useState(null);
  const submitInitiator = useRef('');
  const initialValues = {
    requestType: DEFAULT_REQUEST_TYPE_VALUE,
    fulfillmentPreference: FULFILMENT_TYPES.HOLD_SHELF,
    createTitleLevelRequest: getTlrSettings(settings?.items[0]?.value)?.createTitleLevelRequestsByDefault,
  };

  const findResource = (resource, value, idType = 'id') => {
    const url = urls[resource](value, idType);

    return ky.get(url).json();
  };

  const handleClose = () => {
    const url = getMediatedRequestsActivitiesUrl();

    history.push(url);
  };

  const handleSubmit = (data) => {
    const requestData = cloneDeep(data);
    const isSaveAndCloseAction = submitInitiator.current === SAVE_BUTTON_ID;
    let requestUrl = isSaveAndCloseAction ? 'requests-mediated/mediated-requests' : 'circulation-bff/mediated-requests/confirm';
    let requestMethod = 'post';
    let userData;

    if (isEditMode) {
      requestData.id = request.id;
      requestData.requestLevel = request.requestLevel;

      if (isSaveAndCloseAction) {
        requestMethod = 'put';
        requestUrl = `${requestUrl}/${requestData.id}`;
      }
    } else {
      requestData.requestLevel = getRequestLevelValue(requestData.createTitleLevelRequest);
    }

    requestData.requestDate = moment.tz(intl.timeZone).toISOString();

    if (selectedProxy) {
      userData = selectedProxy;
    } else {
      userData = selectedUser;
    }

    if (!requestData.requestType) {
      unset(requestData, 'requestType');
      unset(requestData, 'fulfillmentPreference');
      unset(requestData, 'deliveryAddressTypeId');
      unset(requestData, 'pickupServicePointId');
    }

    if (requestData.fulfillmentPreference === FULFILMENT_TYPES.HOLD_SHELF || requestData.deliveryAddressTypeId === '') {
      unset(requestData, 'deliveryAddressTypeId');
    }

    if (requestData.fulfillmentPreference === FULFILMENT_TYPES.DELIVERY || requestData.pickupServicePointId === '') {
      unset(requestData, 'pickupServicePointId');
    }

    if (requestData.requestLevel === MEDIATED_REQUEST_LEVEL.ITEM) {
      requestData.instanceId = selectedItem?.instanceId;
      requestData.holdingsRecordId = selectedItem?.holdingsRecordId;
      requestData.itemId = selectedItem?.id;
    }

    if (requestData.requestLevel === MEDIATED_REQUEST_LEVEL.TITLE) {
      requestData.instanceId = selectedInstance?.id;

      unset(requestData, 'itemId');
      unset(requestData, 'holdingsRecordId');
      unset(requestData, 'item');
    }

    unset(requestData, 'createTitleLevelRequest');
    unset(requestData, 'instance');
    unset(requestData, 'requester');
    unset(requestData, 'keyOfItemBarcodeField');
    unset(requestData, 'keyOfUserBarcodeField');
    unset(requestData, 'keyOfInstanceIdField');
    unset(requestData, 'keyOfRequestTypeField');

    return ky[requestMethod](requestUrl, {
      json: requestData,
    })
      .json()
      .then((res) => {
        if (isSaveAndCloseAction) {
          callout.sendCallout({
            message: <FormattedMessage id="ui-requests-mediated.form.saveRequest.success" />,
          });
        } else {
          const {
            firstName,
            lastName,
          } = userData.personal;
          const requesterName = `${lastName}${firstName ? ', ' + firstName : ''}`;

          callout.sendCallout({
            message: <FormattedMessage
              id="ui-requests-mediated.form.createRequest.success"
              values={{ requester: requesterName }}
            />,
          });
        }

        const mediatedRequestId = res.id || requestData.id;
        const url = `${getMediatedRequestsActivitiesUrl()}/preview/${mediatedRequestId}`;

        history.push(url);
      })
      .catch(() => {
        const message = isSaveAndCloseAction ?
          <FormattedMessage id="ui-requests-mediated.form.saveRequest.error" /> :
          <FormattedMessage id="ui-requests-mediated.form.createRequest.error" />;

        callout.sendCallout({
          type: 'error',
          message,
        });
      });
  };

  return (
    <RequestForm
      request={request}
      selectedItem={selectedItem}
      selectedUser={selectedUser}
      selectedProxy={selectedProxy}
      selectedInstance={selectedInstance}
      onSetSelectedItem={setSelectedItem}
      onSetSelectedUser={setSelectedUser}
      onSetSelectedProxy={setSelectedProxy}
      onSetSelectedInstance={setSelectedInstance}
      submitInitiator={submitInitiator}
      addressTypes={addressTypes}
      settings={settings}
      patronGroups={patronGroups}
      initialValues={initialValues}
      findResource={findResource}
      onSubmit={handleSubmit}
      onCancel={handleClose}
      isEditMode={isEditMode}
      setRequest={setRequest}
    />
  );
};

RequestFormContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  patronGroups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    group: PropTypes.string,
  })).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  setRequest: PropTypes.func,
  request: PropTypes.object,
};

export default RequestFormContainer;
