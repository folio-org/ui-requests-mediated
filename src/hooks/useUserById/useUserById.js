import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useUserById = (userId, isFetching) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'users' });
  const searchParams = { query: `(id==${userId})` };
  const { data } = useQuery(
    [namespace],
    () => ky.get('users', { searchParams }).json(),
    { enabled: Boolean(userId && !isFetching) },
  );

  return { userData: data };
};

export default useUserById;
