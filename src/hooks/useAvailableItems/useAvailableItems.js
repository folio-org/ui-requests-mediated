import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useAvailableItems = (instanceId, open) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'availableItems' });
  const searchParams = { query: `id==${instanceId}` };

  const {
    data,
    isFetching,
  } = useQuery(
    [namespace],
    () => ky.get('circulation/items-by-instance', { searchParams }).json(),
    { enabled: Boolean(instanceId && open) },
  );

  return {
    isFetching,
    data,
  };
};

export default useAvailableItems;
