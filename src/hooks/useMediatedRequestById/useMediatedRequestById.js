import {
  useState,
} from 'react';

import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const useMediatedRequestById = (mediatedRequestId) => {
  const [shouldUpdateMediatedRequestById, setShouldUpdateMediatedRequestById] = useState(0);

  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'mediatedRequest' });
  const {
    data,
    isFetching,
  } = useQuery(
    [namespace, mediatedRequestId, shouldUpdateMediatedRequestById],
    () => ky.get(`requests-mediated/mediated-requests/${mediatedRequestId}`).json(),
    { enabled: Boolean(mediatedRequestId) },
  );

  return {
    isFetching,
    mediatedRequest: data,
    shouldUpdateMediatedRequestById,
    setShouldUpdateMediatedRequestById,
  };
};

export default useMediatedRequestById;
