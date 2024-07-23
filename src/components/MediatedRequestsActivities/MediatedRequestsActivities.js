import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IfPermission,
  AppIcon,
} from '@folio/stripes/core';
import {
  Button,
  Icon,
  Pane,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';
import {
  SearchAndSortQuery,
  ExpandFilterPaneButton,
  CollapseFilterPaneButton,
  ColumnManager,
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
  MEDIATED_REQUESTS_RECORD_FIELD_NAME,
  MEDIATED_REQUESTS_RECORD_TRANSLATIONS,
  ICONS,
  getMediatedRequestsActivitiesUrl,
} from '../../constants';

export const getActionMenu = (renderColumnsMenu) => () => {
  return (
    <>
      <IfPermission perm="ui-requests-mediated.view-create-edit">
        <Button
          buttonStyle="dropdownItem"
          marginBottom0
        >
          <Icon icon={ICONS.PLUS_SIGN}>
            <FormattedMessage id="ui-requests-mediated.mediatedRequestList.actionMenu.newMediatedRequest" />
          </Icon>
        </Button>
      </IfPermission>
      {renderColumnsMenu}
    </>
  );
};

const MediatedRequestsActivities = ({
  querySetter,
  queryGetter,
  source,
  resources,
  mutator: {
    resultOffset,
  },
  settings,
  children,
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

  const mediatedRequests = resources[MEDIATED_REQUESTS_RECORDS_NAME]?.records?.[0]?.mediatedRequests ?? [];
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
          <ColumnManager
            id="mediatedRequestsActivitiesColumnManager"
            columnMapping={MEDIATED_REQUESTS_RECORD_TRANSLATIONS}
            excludeKeys={[MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]}
          >
            {({ renderColumnsMenu, visibleColumns }) => (
              <Pane
                defaultWidth="fill"
                appIcon={<AppIcon app={APP_ICON_NAME} />}
                paneTitle={<FormattedMessage id="ui-requests-mediated.app.mediatedRequestsActivities.paneTitle" />}
                firstMenu={renderResultsFirstMenu(activeFilters)}
                actionMenu={getActionMenu(renderColumnsMenu)}
              >
                <MediatedRequestsList
                  visibleColumns={visibleColumns}
                  contentData={mediatedRequests}
                  source={source}
                  query={query}
                />
              </Pane>
            )}
          </ColumnManager>
          { children }
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
  children: PropTypes.node,
};

export default MediatedRequestsActivities;
