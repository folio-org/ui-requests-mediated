import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { MAX_RECORDS } from '../../constants';

const useServicePoints = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'servicePoints' });
  const searchParams = {
    query: 'query=(pickupLocation==true) sortby name',
    limit: MAX_RECORDS,
  };
  const { data } = useQuery(
    [namespace],
    () => ky.get('service-points', { searchParams }).json(),
    { enabled: true },
  );

  return { servicePoints: data };
};

export default useServicePoints;
