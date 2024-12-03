import PropTypes from 'prop-types';

import {
  MediatedRequestLevelFilter,
  MediatedRequestStatusFilter,
  Search,
} from './components';

import {
  getIsTitleLevelRequestsFeatureEnabled,
} from '../../../../utils';

import {
  MEDIATED_REQUEST_LEVEL_PROP_TYPES,
  MEDIATED_REQUEST_STATUS_PROP_TYPES,
} from '../../../../constants';

const MediatedRequestsFilters = ({
  getSearchHandlers,
  searchValue,
  onSubmitSearch,
  resetAll,
  activeFilters,
  onChangeHandlers,
  resultOffset,
  settings,
}) => {
  const isTitleLevelRequestsFeatureEnabled = getIsTitleLevelRequestsFeatureEnabled(settings);

  return (
    <form
      data-testid="MediatedRequestsFiltersForm"
      onSubmit={onSubmitSearch}
    >
      <Search
        data-testid="MediatedRequestsFiltersSearch"
        activeFilters={activeFilters}
        getSearchHandlers={getSearchHandlers}
        searchValue={searchValue}
        resetAll={resetAll}
      />
      <MediatedRequestStatusFilter
        data-testid="mediatedRequestFiltersStatusFilter"
        activeFilters={activeFilters}
        onChangeHandlers={onChangeHandlers}
        resultOffset={resultOffset}
      />
      {isTitleLevelRequestsFeatureEnabled && (
        <MediatedRequestLevelFilter
          data-testid="mediatedRequestFiltersLevelFilter"
          activeFilters={activeFilters}
          onChangeHandlers={onChangeHandlers}
          resultOffset={resultOffset}
        />
      )}
    </form>
  );
};

MediatedRequestsFilters.propTypes = {
  activeFilters: PropTypes.shape({
    ...MEDIATED_REQUEST_STATUS_PROP_TYPES,
    ...MEDIATED_REQUEST_LEVEL_PROP_TYPES,
  }).isRequired,
  searchValue: PropTypes.shape({
    query: PropTypes.string,
  }).isRequired,
  getSearchHandlers: PropTypes.func.isRequired,
  resetAll: PropTypes.func.isRequired,
  onSubmitSearch: PropTypes.func.isRequired,
  onChangeHandlers: PropTypes.shape({
    clearGroup: PropTypes.func.isRequired,
    state: PropTypes.func.isRequired,
  }).isRequired,
  resultOffset: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  settings: PropTypes.object.isRequired,
};

export default MediatedRequestsFilters;
