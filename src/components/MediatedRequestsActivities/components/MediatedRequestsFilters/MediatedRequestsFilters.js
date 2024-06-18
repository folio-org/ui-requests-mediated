import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import {
  MediatedRequestLevelFilter,
  MediatedRequestStatusFilter,
  Search,
} from './components';

import {
  getIsTitleLevelRequestsFeatureEnabled,
} from '../../../../utils';

const SETTINGS_SCOPES = {
  CIRCULATION: 'circulation',
};
const SETTINGS_KEYS = {
  GENERAL_TLR: 'generalTlr',
};

const MediatedRequestsFilters = ({
  resources,
}) => {
  const isTitleLevelRequestsFeatureEnabled = getIsTitleLevelRequestsFeatureEnabled(resources);

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

MediatedRequestsFilters.manifest = {
  configs: {
    type: 'okapi',
    records: 'items',
    path: 'settings/entries',
    params: {
      query: `(scope==${SETTINGS_SCOPES.CIRCULATION} and key==${SETTINGS_KEYS.GENERAL_TLR})`,
    },
  },
};

MediatedRequestsFilters.propTypes = {
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(MediatedRequestsFilters);
