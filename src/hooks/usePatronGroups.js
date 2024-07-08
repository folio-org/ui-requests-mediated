import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { MAX_RECORDS } from '../constants';

const usePatronGroups = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'patronGroups' });
  const searchParams = {
    query: 'cql.allRecords=1 sortby group',
    limit: MAX_RECORDS,
  };
  const { data } = useQuery(
    [namespace],
    () => ky.get('groups', { searchParams }).json(),
    { enabled: true },
  );

  return ({ patronGroups: data?.usergroups });
};

export default usePatronGroups;
