import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { stringify } from 'query-string';

import { useOkapiKy } from '@folio/stripes/core';

import RequestForm from '../RequestForm';
import {
  getInstanceQueryString,
  getStatusQuery,
  getTlrSettings,
} from '../../../../utils';
import {
  ITEM_QUERIES,
  MAX_RECORDS,
  OPEN_REQUESTS_STATUSES,
  getMediatedRequestsActivitiesUrl,
} from '../../../../constants';

export const urls = {
  user: (value, idType) => {
    const query = stringify({
      query: `(${idType}=="${value}")`,
    });

    return `users?${query}`;
  },
  item: (value, idType) => {
    const query = stringify({
      query: `(${ITEM_QUERIES[idType]}=="${value}")`,
    });

    return `circulation/items-by-instance?${query}`;
  },
  instance: (value) => {
    const query = stringify({
      query: getInstanceQueryString(value),
    });

    return `circulation/items-by-instance?${query}`;
  },
  loan: (value) => {
    const query = stringify({
      query: `(itemId=="${value}") and status.name==Open`,
    });

    return `circulation/loans?${query}`;
  },
  requestsForItem: (value) => {
    const statusQuery = getStatusQuery(OPEN_REQUESTS_STATUSES);
    const query = stringify({
      query: `(itemId=="${value}" and (${statusQuery}))`,
      limit: MAX_RECORDS,
    });

    return `circulation/requests?${query}`;
  },
  requestsForInstance: (value) => {
    const statusQuery = getStatusQuery(OPEN_REQUESTS_STATUSES);
    const query = stringify({
      query: `(instanceId=="${value}" and (${statusQuery}))`,
      limit: MAX_RECORDS,
    });

    return `circulation/requests?${query}`;
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
  const history = useHistory();
  const [selectedItem, setSelectedItem] = useState(item);
  const [selectedInstance, setSelectedInstance] = useState(instance);
  const [selectedUser, setSelectedUser] = useState({
    ...requester,
    id: requesterId,
  });
  const initialValues = {
    createTitleLevelRequest: getTlrSettings(settings?.items[0]?.value)?.createTitleLevelRequestsByDefault,
  };

  const findResource = async (resource, value, idType = 'id') => {
    const url = urls[resource](value, idType);

    return await ky.get(url).json();
  }

  const handleSubmit = (data) => {
    const requestData = cloneDeep(data);
    // temporary solution
    console.log('Data to save: ', requestData);
  };

  const handleClose = () => {
    const url = getMediatedRequestsActivitiesUrl();

    history.push(url);
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
