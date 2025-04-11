import PropTypes from 'prop-types';
import {
  useLocation,
} from 'react-router-dom';
import {
  get,
  noop,
} from 'lodash';

import {
  AppIcon,
} from '@folio/stripes/core';
import {
  MultiColumnList,
  FormattedTime,
  MCLPagingTypes,
  TextLink,
  NoValue,
} from '@folio/stripes/components';

import {
  SearchAndSortNoResultsMessage,
} from '@folio/stripes/smart-components';
import {
  effectiveCallNumber,
} from '@folio/stripes/util';

import {
  getRequesterName,
  getTotalCount,
} from '../../../../utils';
import {
  APP_ICON_NAME,
  DEFAULT_VIEW_VALUE,
  PAGE_AMOUNT,
  MEDIATED_REQUESTS_ACTIVITIES,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME,
  MEDIATED_REQUESTS_RECORD_FIELD_PATH,
  MEDIATED_REQUESTS_RECORD_TRANSLATIONS,
  MODULE_ROUTE,
  CONTENT_DATA_PROP_TYPES,
} from '../../../../constants';

export const SORT_DIRECTION = '-';
export const ASCENDING = 'ascending';
export const DESCENDING = 'descending';

export const getSortOrder = (sortOrder) => (
  sortOrder.startsWith(SORT_DIRECTION) ? DESCENDING : ASCENDING
);
export const COLUMN_WIDTHS = {
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]: { max: 130 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE]: { max: 190 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: { max: 225 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS]: { max: 210 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER]: { max: 120 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]: { max: 120 },
};
export const getMediatedRequestsListFormatter = (location) => ({
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]: (mediatedRequest) => {
    const title = get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]);

    return title ?
      <TextLink to={`/${MODULE_ROUTE}/${MEDIATED_REQUESTS_ACTIVITIES}/preview/${mediatedRequest[MEDIATED_REQUESTS_RECORD_FIELD_NAME.ID]}${location.search}`}>
        {title}
      </TextLink> :
      <NoValue />;
  },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]: (mediatedRequest) => (
    get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE], <NoValue />)
  ),
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE]: (mediatedRequest) => (
    <AppIcon
      size="small"
      app={APP_ICON_NAME}
    >
      <FormattedTime
        value={get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE], DEFAULT_VIEW_VALUE)}
        day="numeric"
        month="numeric"
        year="numeric"
      />
    </AppIcon>
  ),
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: (mediatedRequest) => {
    const item = get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM], {});

    return effectiveCallNumber(item) || <NoValue />;
  },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS]: (mediatedRequest) => (
    get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS], <NoValue />)
  ),
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER]: (mediatedRequest) => (getRequesterName(mediatedRequest) || <NoValue />),
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]: (mediatedRequest) => (
    get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE], <NoValue />)
  ),
});
export const emptyMessage = (source, query) => (
  source
    ? <SearchAndSortNoResultsMessage
        source={source}
        searchTerm={query.query || ''}
        filterPaneIsVisible
        toggleFilterPane={noop}
    />
    : null
);

const MediatedRequestsList = ({
  visibleColumns,
  contentData,
  source,
  query,
  onSort,
  onNeedMoreData,
}) => {
  const location = useLocation();
  const sortOrder = query.sort || '';
  const totalCount = getTotalCount(source);

  return (
    <MultiColumnList
      id="mediatedRequestsList"
      data-testid="mediatedRequestsList"
      visibleColumns={visibleColumns}
      columnWidths={COLUMN_WIDTHS}
      columnMapping={MEDIATED_REQUESTS_RECORD_TRANSLATIONS}
      contentData={contentData}
      totalCount={totalCount}
      formatter={getMediatedRequestsListFormatter(location)}
      isEmptyMessage={emptyMessage(source, query)}
      onNeedMoreData={onNeedMoreData}
      onHeaderClick={onSort}
      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
      sortDirection={getSortOrder(sortOrder)}
      fullWidth
      autosize
      hasMargin
      pageAmount={PAGE_AMOUNT}
      pagingType={MCLPagingTypes.PREV_NEXT}
    />
  );
};

MediatedRequestsList.propTypes = {
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  contentData: CONTENT_DATA_PROP_TYPES,
  source: PropTypes.shape({
    totalCount: PropTypes.func,
  }).isRequired,
  query: PropTypes.shape({
    query: PropTypes.string,
    sort: PropTypes.string,
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
};

export default MediatedRequestsList;
