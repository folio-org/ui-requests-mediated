import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useMediatedRequestById = (mediatedRequestId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'mediatedRequest' });
  const {
    data,
    isFetching,
  } = useQuery(
    [namespace, mediatedRequestId],
    () => ky.get(`requests-mediated/mediated-requests/${mediatedRequestId}`).json(),
    { enabled: Boolean(mediatedRequestId) },
  );

  return {
    isFetching,
    mediatedRequest: data,
  };
};

export default useMediatedRequestById;
