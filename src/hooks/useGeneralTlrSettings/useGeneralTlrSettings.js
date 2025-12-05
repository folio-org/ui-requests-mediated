import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const useGeneralTlrSettings = (enabled) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'circulationSettings' });
  const searchParams = {
    query: '(name==generalTlr)',
  };

  const { isLoading, data, refetch, isFetching } = useQuery(
    [namespace],
    () => ky.get('circulation/settings', { searchParams }).json(),
    { enabled },
  );

  return ({
    settings: data,
    isLoading,
    isFetching,
    refetch,
  });
};

export default useGeneralTlrSettings;
