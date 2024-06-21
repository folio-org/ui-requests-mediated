import { stripesConnect } from '@folio/stripes/core';

import {
  MediatedRequestLevelFilter,
  MediatedRequestStatusFilter,
  Search,
} from './components';

import {
  getIsTitleLevelRequestsFeatureEnabled,
} from '../../../../utils';
import {
  useGeneralTlrSettings
} from '../../../../hooks';

const MediatedRequestsFilters = () => {
  const { data } = useGeneralTlrSettings();
  const isTitleLevelRequestsFeatureEnabled = getIsTitleLevelRequestsFeatureEnabled(data);

  return (
    <form
      data-testid="MediatedRequestsFiltersForm"
    >
      <Search
        data-testid="MediatedRequestsFiltersSearch"
      />
      <MediatedRequestStatusFilter
        data-testid="mediatedRequestFiltersStatusFilter"
      />
      {isTitleLevelRequestsFeatureEnabled && (
        <MediatedRequestLevelFilter
          data-testid="mediatedRequestFiltersLevelFilter"
        />
      )}
    </form>
  );
};

export default stripesConnect(MediatedRequestsFilters);
