import {
  MediatedRequestLevelFilter,
  MediatedRequestStatusFilter,
  Search,
} from './components';

import {
  getIsTitleLevelRequestsFeatureEnabled,
} from '../../../../utils';

const MediatedRequestsFilters = ({ settings }) => {
  const isTitleLevelRequestsFeatureEnabled = getIsTitleLevelRequestsFeatureEnabled(settings);

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

export default MediatedRequestsFilters;
