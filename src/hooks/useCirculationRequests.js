import { useQuery } from 'react-query';
import { chunk } from 'lodash';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  MAX_RECORDS,
  OPEN_REQUESTS_STATUSES,
} from '../constants';
import { getStatusQuery } from  '../utils';

const CHUNK_SIZE = 40;

export const getItems = async (ky, instanceId) => {
  const query = `id==${instanceId}`;
  const searchParams = { query };

  return await ky.get('circulation/items-by-instance', { searchParams }).json();
};

export const getRequests = async (ky, instanceId) => {
  const itemsList = await getItems(ky, instanceId);
  const chunkedItems = chunk(itemsList.items, CHUNK_SIZE);
  const requests = [];

  for (const itemChunk of chunkedItems) {
    let query = itemChunk.map(i => `itemId==${i.id}`).join(' or ');
    const statusQuery = getStatusQuery(OPEN_REQUESTS_STATUSES);

    query = `(${query}) and (${statusQuery})")`;

    const searchParams = {
      query,
      limit: MAX_RECORDS,
    };

    // eslint-disable-next-line no-await-in-loop
    const result = await ky.get('circulation/requests', { searchParams }).json();

    requests.push(...result.requests);
  }

  return {
    requests,
    itemsList: itemsList.items,
  };
};

const useCirculationRequests = (instanceId, open) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'availableItems' });
  const getItemsData = async () => await getRequests(ky, instanceId);

  const {
    data,
    isFetching,
  } = useQuery(
    [namespace],
    getItemsData,
    { enabled: Boolean(instanceId && open) },
  );

  return ({
    isFetching,
    data,
  });
};

export default useCirculationRequests;
