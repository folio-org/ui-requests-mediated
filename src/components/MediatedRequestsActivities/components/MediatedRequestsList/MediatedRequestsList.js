import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
  MEDIATED_REQUESTS_RECORD_FIELD_NAME,
  MEDIATED_REQUESTS_RECORD_FIELD_PATH,
} from '../../../../constants';


export const MEDIATED_REQUEST_COLUMNS_NAME = [
  MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE,
];
export const COLUMN_WIDTHS = {
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER]: { max: 150 },
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]: { max: 150 },
};
export const COLUMN_MAPPING = {
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.title" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.itemBarcode" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.mediatedRequestDate" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.effectiveCallNumber" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.mediatedRequestStatus" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.requester" />,
  [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]: <FormattedMessage id="ui-requests-mediated.mediatedRequestList.columnName.requesterBarcode" />,
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
  contentData,
  source,
  query,
}) => {
  return (
    <MultiColumnList
      id="mediatedRequestsList"
      data-testid="mediatedRequestsList"
      visibleColumns={MEDIATED_REQUEST_COLUMNS_NAME}
      columnWidths={COLUMN_WIDTHS}
      columnMapping={COLUMN_MAPPING}
      contentData={contentData}
      formatter={mediatedRequestsListFormatter}
      isEmptyMessage={emptyMessage(source, query)}
    />
  );
};

MediatedRequestsList.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  source: PropTypes.object,
  query: PropTypes.shape({
    query: PropTypes.string,
  }).isRequired,
};

export default MediatedRequestsList;
