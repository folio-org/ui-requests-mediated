import PropTypes from 'prop-types';
import {
  useHistory,
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
} from '@folio/stripes/components';
import {
  SearchAndSortNoResultsMessage,
} from '@folio/stripes/smart-components';
import {
  effectiveCallNumber,
} from '@folio/stripes/util';

import {
  getRequesterName,
} from '../../../../utils';
import {
  APP_ICON_NAME,
  DEFAULT_VIEW_VALUE,
  MEDIATED_REQUESTS_ACTIVITIES,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME,
  MEDIATED_REQUESTS_RECORD_FIELD_PATH,
  MEDIATED_REQUESTS_RECORD_TRANSLATIONS,
  MODULE_ROUTE,
} from '../../../../constants';

export const COLUMN_WIDTHS = {
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]: { max: 150 },
};
export const mediatedRequestsListFormatter = {
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]: (mediatedRequest) => (
    get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE], DEFAULT_VIEW_VALUE)
  ),
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]: (mediatedRequest) => (
    get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE], DEFAULT_VIEW_VALUE)
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

    return effectiveCallNumber(item);
  },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS]: (mediatedRequest) => (
    get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS], DEFAULT_VIEW_VALUE)
  ),
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER]: (mediatedRequest) => (getRequesterName(mediatedRequest)),
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]: (mediatedRequest) => (
    get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE], DEFAULT_VIEW_VALUE)
  ),
};
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
}) => {
  const history = useHistory();
  const location = useLocation();

  const onRowClick = (e, row) => {
    history.push(`/${MODULE_ROUTE}/${MEDIATED_REQUESTS_ACTIVITIES}/preview/${row.id}${location.search}`);
  };

  return (
    <MultiColumnList
      id="mediatedRequestsList"
      data-testid="mediatedRequestsList"
      visibleColumns={visibleColumns}
      columnWidths={COLUMN_WIDTHS}
      columnMapping={MEDIATED_REQUESTS_RECORD_TRANSLATIONS}
      contentData={contentData}
      formatter={mediatedRequestsListFormatter}
      isEmptyMessage={emptyMessage(source, query)}
      onRowClick={onRowClick}
    />
  );
};

MediatedRequestsList.propTypes = {
  visibleColumns: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  source: PropTypes.object,
  query: PropTypes.shape({
    query: PropTypes.string,
  }).isRequired,
};

export default MediatedRequestsList;
