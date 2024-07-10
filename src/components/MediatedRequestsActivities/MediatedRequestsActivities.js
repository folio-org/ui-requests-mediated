import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';
import {
  Pane,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';
import {
  SearchAndSortQuery,
  ExpandFilterPaneButton,
  CollapseFilterPaneButton,
} from '@folio/stripes/smart-components';

import NavigationMenu from '../NavigationMenu';
import {
  MediatedRequestsFilters,
  MediatedRequestsList,
} from './components';

import {
  APP_ICON_NAME,
  FILTER_PANE_WIDTH,
  MEDIATED_REQUESTS_RECORDS_NAME,
  getMediatedRequestsActivitiesUrl,
} from '../../constants';

const MediatedRequestsActivities = ({
  querySetter,
  queryGetter,
  source,
  resources,
  mutator: {
    resultOffset,
  },
  settings,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
  };

  const renderResultsFirstMenu = (filters) => {
    if (filterPaneIsVisible) {
      return null;
    }

    const filterCount = filters.string === '' ? 0 : filters.string.split(',').length;

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  const mediatedRequests = resources?.[MEDIATED_REQUESTS_RECORDS_NAME]?.records ?? [];
  const query = queryGetter ? queryGetter() || {} : {};

  return (
    <SearchAndSortQuery
      data-testid="mediatedRequestsActivitiesSearchAndSortQuery"
      initialSearchState={{ query: '' }}
      syncToLocationSearch={false}
      querySetter={querySetter}
      queryGetter={queryGetter}
    >
      {({
        activeFilters,
        getSearchHandlers,
        getFilterHandlers,
        searchValue,
        onSubmitSearch,
        resetAll,
      }) => (
        <Paneset data-testid="mediatedRequestsActivitiesPaneSet">
          {filterPaneIsVisible &&
            <Pane
              data-testid="mediatedRequestsActivitiesPane"
              defaultWidth={FILTER_PANE_WIDTH}
              paneTitle={<FormattedMessage id="ui-requests-mediated.app.filterPane.selectActivity" />}
              lastMenu={
                <PaneMenu>
                  <CollapseFilterPaneButton
                    data-testid="mediatedRequestsActivitiesCollapseFilterPaneButton"
                    onClick={toggleFilterPane}
                  />
                </PaneMenu>
              }
            >
              <NavigationMenu
                value={getMediatedRequestsActivitiesUrl()}
                separator
              />
              <MediatedRequestsFilters
                activeFilters={activeFilters?.state}
                getSearchHandlers={getSearchHandlers}
                searchValue={searchValue}
                onSubmitSearch={onSubmitSearch}
                resetAll={resetAll}
                onChangeHandlers={getFilterHandlers()}
                resultOffset={resultOffset}
                settings={settings}
              />
            </Pane>
          }
          <Pane
            defaultWidth="fill"
            appIcon={<AppIcon app={APP_ICON_NAME} />}
            paneTitle={<FormattedMessage id="ui-requests-mediated.app.mediatedRequestsActivities.paneTitle" />}
            firstMenu={renderResultsFirstMenu(activeFilters)}
          >
            <MediatedRequestsList
              contentData={mediatedRequests}
              source={source}
              query={query}
            />
          </Pane>
        </Paneset>
      )}
    </SearchAndSortQuery>
  );
};

MediatedRequestsActivities.propTypes = {
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    [MEDIATED_REQUESTS_RECORDS_NAME]: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    resultOffset: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
  }).isRequired,
  source: PropTypes.object,
  settings: PropTypes.object.isRequired,
};

export default MediatedRequestsActivities;
