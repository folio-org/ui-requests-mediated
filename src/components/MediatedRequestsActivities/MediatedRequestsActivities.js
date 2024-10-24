import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  useHistory,
} from 'react-router-dom';
import { cloneDeep } from 'lodash';

import {
  IfPermission,
  AppIcon,
  useCallout,
} from '@folio/stripes/core';
import {
  Button,
  Icon,
  Pane,
  PaneMenu,
  Paneset,
  exportToCsv,
  filters2cql,
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
  SEARCH_FIELDS,
  FILTER_CONFIG,
  REPORT_HEADERS,
  getMediatedRequestsActivitiesUrl,
} from '../../constants';
import {
  getTotalCount,
  modifyRecordsToExport,
} from '../../utils';

export const getActionMenu = ({
  renderColumnsMenu,
  mediatedRequests,
  searchValue,
  activeFilters,
  reportRecords,
  callout,
  history,
  isLoadingReport,
  setIsLoadingReport,
  formatMessage,
  // eslint-disable-next-line react/prop-types
}) => ({ onToggle }) => { // NOSONAR
  const goToNewMediatedRequest = () => {
    history.push(`${getMediatedRequestsActivitiesUrl()}/create`);
  };

  const getRecords = async (query) => {
    const {
      GET,
      reset,
    } = reportRecords;

    const limit = 1000;
    const data = [];
    let offset = 0;
    let hasData = true;

    while (hasData) {
      try {
        reset();
        // eslint-disable-next-line no-await-in-loop
        const result = await GET({
          params: {
            query,
            limit,
            offset,
          },
        });
        hasData = result.length;
        offset += limit;

        if (hasData) {
          data.push(...result);
        }

        if (result.length < limit) {
          hasData = false;
        }
      } catch (err) {
        hasData = false;
      }
    }

    return data;
  };

  const getColumnHeaders = (headers) => {
    return headers.map(header => ({
      label: formatMessage({ id: `ui-requests-mediated.report.${header}` }),
      value: header,
    }));
  };

  const buildRecords = (records) => {
    const clonedRecords = cloneDeep(records);

    return modifyRecordsToExport(clonedRecords);
  };

  const exportResults = async () => {
    setIsLoadingReport(true);
    onToggle();
    callout.sendCallout({
      message: <FormattedMessage id="ui-requests-mediated.mediatedRequest.notification.CSVReport" />
    });
    const queryParams = [];

    if (searchValue?.query) {
      const searchQuery = SEARCH_FIELDS.map(searchSubQuery => `${searchSubQuery}==${searchValue.query}*`).join(' or ');

      queryParams.push(`(${searchQuery})`);
    }

    if (activeFilters?.string) {
      const filterQuery = filters2cql(FILTER_CONFIG, activeFilters.string);

      queryParams.push(filterQuery);
    }

    const queryString = queryParams.join(' and ');
    const records = await getRecords(queryString);
    const recordsToCSV = buildRecords(records);
    const columns = getColumnHeaders(REPORT_HEADERS);

    exportToCsv(recordsToCSV, {
      onlyFields: columns,
    });
    setIsLoadingReport(false);
  };

  return (
    <>
      <IfPermission perm="ui-requests-mediated.requests-mediated.view-create-edit.execute">
        <Button
          buttonStyle="dropdownItem"
          marginBottom0
          onClick={goToNewMediatedRequest}
        >
          <Icon icon={ICONS.PLUS_SIGN}>
            <FormattedMessage id="ui-requests-mediated.mediatedRequestList.actionMenu.newMediatedRequest" />
          </Icon>
        </Button>
      </IfPermission>
      <IfPermission perm="ui-requests-mediated.view">
        {
          isLoadingReport ?
            <Button
              buttonStyle="dropdownItem"
              disabled
            >
              <Icon
                icon={ICONS.SPINNER}
                width="10px"
              >
                <FormattedMessage id="ui-requests-mediated.mediatedRequestList.actionMenu.reportPending" />
              </Icon>
            </Button> :
            <Button
              buttonStyle="dropdownItem"
              onClick={exportResults}
              disabled={!mediatedRequests?.length}
              marginBottom0
            >
              <Icon icon={ICONS.DOWNLOAD}>
                <FormattedMessage id="ui-requests-mediated.mediatedRequestList.actionMenu.exportResults" />
              </Icon>
            </Button>
        }
      </IfPermission>
      {renderColumnsMenu}
    </>
  );
};

export const getResultPaneSub = (source) => {
  let resultPaneSub = <FormattedMessage id="stripes-smart-components.searchCriteria" />;

  if (source?.loaded()) {
    const count = getTotalCount(source);

    resultPaneSub = <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
  }

  return resultPaneSub;
};

const MediatedRequestsActivities = ({
  querySetter,
  queryGetter,
  onNeedMoreData,
  source,
  resources,
  mutator: {
    resultOffset,
    reportRecords,
  },
  settings,
  children,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const history = useHistory();
  const callout = useCallout();
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const { formatMessage } = useIntl();

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

  const mediatedRequests = resources[MEDIATED_REQUESTS_RECORDS_NAME]?.records ?? [];
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
        onSort,
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
                padContent={false}
                noOverflow
                appIcon={<AppIcon app={APP_ICON_NAME} />}
                paneTitle={<FormattedMessage id="ui-requests-mediated.mediatedRequestsActivities.paneTitle" />}
                paneSub={getResultPaneSub(source)}
                firstMenu={renderResultsFirstMenu(activeFilters)}
                actionMenu={
                  getActionMenu({
                    renderColumnsMenu,
                    mediatedRequests,
                    searchValue,
                    activeFilters,
                    reportRecords,
                    callout,
                    history,
                    isLoadingReport,
                    setIsLoadingReport,
                    formatMessage,
                  })
                }
              >
                <MediatedRequestsList
                  visibleColumns={visibleColumns}
                  contentData={mediatedRequests}
                  source={source}
                  query={query}
                  onSort={onSort}
                  onNeedMoreData={onNeedMoreData}
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
  onNeedMoreData: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    [MEDIATED_REQUESTS_RECORDS_NAME]: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    resultOffset: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
    reportRecords: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
    }),
  }).isRequired,
  source: PropTypes.shape({
    totalCount: PropTypes.func,
    loaded: PropTypes.func,
  }).isRequired,
  settings: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default MediatedRequestsActivities;
