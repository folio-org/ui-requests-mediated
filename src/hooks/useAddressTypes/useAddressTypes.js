import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { MAX_RECORDS } from '../../constants';

const useAddressTypes = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'addressTypes' });
  const searchParams = {
    query: 'cql.allRecords=1 sortby addressType',
    limit: MAX_RECORDS,
  };
  const { data } = useQuery(
    [namespace],
    () => ky.get('addresstypes', { searchParams }).json(),
    { enabled: true },
  );

  return { addressTypes: data };
};

export default useAddressTypes;
