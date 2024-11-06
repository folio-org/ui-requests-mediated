import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  MAX_RECORDS,
} from '../../constants';

const useStaffSlipsTemplate = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'useStaffSlipsTemplate' });
  const {
    data,
    isFetching,
  } = useQuery(
    [namespace],
    () => ky.get(`staff-slips-storage/staff-slips?limit=${MAX_RECORDS}`).json(),
    { enabled: true },
  );

  return {
    isFetching,
    ...data,
  };
};

export default useStaffSlipsTemplate;
