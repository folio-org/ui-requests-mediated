import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

const SETTINGS_SCOPES = {
  CIRCULATION: 'circulation',
};
const SETTINGS_KEYS = {
  GENERAL_TLR: 'generalTlr',
};

const useGeneralTlrSettings = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'generalTlrSettings' });
  const searchParams = {
    query: `(scope==${SETTINGS_SCOPES.CIRCULATION} and key==${SETTINGS_KEYS.GENERAL_TLR})`,
  };

  const { isLoading, data, refetch, isFetching } = useQuery(
    [namespace],
    () => ky.get('settings/entries', { searchParams }).json(),
    { enabled: true },
  );

  return ({
    isLoading,
    isFetching,
    data,
    refetch,
  });
};

export default useGeneralTlrSettings;
