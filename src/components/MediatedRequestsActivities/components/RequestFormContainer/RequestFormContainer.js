import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  cloneDeep,
  unset,
  isString,
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
  REQUEST_LEVEL_TYPES,
  SAVE_BUTTON_ID,
  getMediatedRequestsActivitiesUrl,
} from '../../../../constants';
import useAddressTypes from '../../../../hooks/useAddressTypes';

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

    return `circulation/items-by-instance?${query}`;
  },
  [RESOURCE_TYPES.INSTANCE]: (value) => {
    const query = stringify({
      query: getInstanceQueryString(value),
    });

    return `circulation/items-by-instance?${query}`;
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
    const url = 'circulation/requests/allowed-service-points';

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
};

const RequestFormContainer = ({
  request,
  settings,
  patronGroups,
}) => {
  const {
    requester,
    requesterId,
    item,
    instance,
  } = request || {};
  const ky = useOkapiKy();
  const intl = useIntl();
  const history = useHistory();
  const callout = useCallout();
  const { addressTypes } = useAddressTypes();
  const [selectedItem, setSelectedItem] = useState(item);
  const [selectedInstance, setSelectedInstance] = useState(instance);
  const [selectedUser, setSelectedUser] = useState({
    ...requester,
    id: requesterId,
  });
  const [submitInitiator, setSubmitInitiator] = useState(null);
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

    requestData.requestDate = moment.tz(intl.timeZone).toISOString();
    requestData.requestLevel = getRequestLevelValue(requestData.createTitleLevelRequest);

    if (requestData.fulfillmentPreference === FULFILMENT_TYPES.HOLD_SHELF && isString(requestData.deliveryAddressTypeId)) {
      unset(requestData, 'deliveryAddressTypeId');
    }

    if (requestData.fulfillmentPreference === FULFILMENT_TYPES.DELIVERY && isString(requestData.pickupServicePointId)) {
      unset(requestData, 'pickupServicePointId');
    }

    if (requestData.requestLevel === REQUEST_LEVEL_TYPES.ITEM) {
      requestData.instanceId = selectedItem?.instanceId;
      requestData.holdingsRecordId = selectedItem?.holdingsRecordId;
    }

    if (requestData.requestLevel === REQUEST_LEVEL_TYPES.TITLE) {
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

    return ky.post('circulation/requests', {
      json: { ...requestData },
    })
      .json()
      .then(() => {
        if (submitInitiator === SAVE_BUTTON_ID) {
          callout.sendCallout({
            message: <FormattedMessage id="ui-requests-mediated.form.saveRequest.success" />,
          });
        } else {
          const {
            firstName,
            lastName,
          } = requestData.requester.personal;
          const user = `${lastName}${firstName ? ', ' + firstName : ''}`;

          callout.sendCallout({
            message: <FormattedMessage
              id="ui-requests-mediated.form.createRequest.success"
              values={{ requester: user }}
            />,
          });
        }

        handleClose();
      })
      .catch(() => {
        callout.sendCallout({
          type: 'error',
          message: <FormattedMessage id="ui-requests-mediated.form.saveRequest.error" />,
        });
      });
  };

  return (
    <RequestForm
      request={request}
      selectedItem={selectedItem}
      selectedUser={selectedUser}
      selectedInstance={selectedInstance}
      onSetSelectedItem={setSelectedItem}
      onSetSelectedUser={setSelectedUser}
      onSetSelectedInstance={setSelectedInstance}
      onSetSubmitInitiator={setSubmitInitiator}
      addressTypes={addressTypes}
      settings={settings}
      patronGroups={patronGroups}
      initialValues={initialValues}
      findResource={findResource}
      onSubmit={handleSubmit}
      onCancel={handleClose}
    />
  );
};

RequestFormContainer.propTypes = {
  settings: PropTypes.object.isRequired,
  patronGroups: PropTypes.object.isRequired,
  request: PropTypes.object,
};

export default RequestFormContainer;
