import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import {
  get,
  omit,
} from 'lodash';

import {
  AppIcon,
} from '@folio/stripes/core';
import {
  FormattedTime,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  effectiveCallNumber,
} from '@folio/stripes/util';

import {
  APP_ICON_NAME,
  CONFIRM_ITEM_RECORD_FIELD_NAME,
  CONFIRM_ITEM_RECORD_TRANSLATIONS,
  CONFIRM_ITEM_RECORD_FIELD_PATH,
  CONFIRM_ITEM_TYPES,
  DEFAULT_VIEW_VALUE,
} from '../../../constants';
import {
  getRequesterName,
} from '../../../utils';

export const CONFIRM_ITEM_COLUMNS_NAME = [
  CONFIRM_ITEM_RECORD_FIELD_NAME.DATE,
  CONFIRM_ITEM_RECORD_FIELD_NAME.TITLE,
  CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM_BARCODE,
  CONFIRM_ITEM_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER,
  CONFIRM_ITEM_RECORD_FIELD_NAME.MEDIATED_REQUEST_STATUS,
  CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER,
  CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER_BARCODE,
];
export const COLUMN_WIDTHS = {
  [CONFIRM_ITEM_RECORD_FIELD_NAME.DATE]: { max: 180 },
  [CONFIRM_ITEM_RECORD_FIELD_NAME.TITLE]: { max: 150 },
  [CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM_BARCODE]: { max: 130 },
  [CONFIRM_ITEM_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: { max: 180 },
  [CONFIRM_ITEM_RECORD_FIELD_NAME.MEDIATED_REQUEST_STATUS]: { max: 180 },
  [CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER]: { max: 120 },
  [CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER_BARCODE]: { max: 120 },
};
export const getConfirmItemColumnMapping = (confirmItemType) => {
  const COLUMN_MAPPING = CONFIRM_ITEM_RECORD_TRANSLATIONS;

  COLUMN_MAPPING[CONFIRM_ITEM_RECORD_FIELD_NAME.DATE] = confirmItemType === CONFIRM_ITEM_TYPES.CONFIRM_ITEM_ARRIVAL
    ? CONFIRM_ITEM_RECORD_TRANSLATIONS[CONFIRM_ITEM_RECORD_FIELD_NAME.ARRIVAL_DATE]
    : CONFIRM_ITEM_RECORD_TRANSLATIONS[CONFIRM_ITEM_RECORD_FIELD_NAME.IN_TRANSIT_DATE];

  return omit(COLUMN_MAPPING, [CONFIRM_ITEM_RECORD_FIELD_NAME.ARRIVAL_DATE, CONFIRM_ITEM_RECORD_FIELD_NAME.IN_TRANSIT_DATE]);
};
export const getConfirmItemListFormatter = (confirmItemType) => ({
  [CONFIRM_ITEM_RECORD_FIELD_NAME.DATE]: (confirmItem) => {
    const datePath = confirmItemType === CONFIRM_ITEM_TYPES.CONFIRM_ITEM_ARRIVAL
      ? CONFIRM_ITEM_RECORD_FIELD_PATH[CONFIRM_ITEM_RECORD_FIELD_NAME.ARRIVAL_DATE]
      : CONFIRM_ITEM_RECORD_FIELD_PATH[CONFIRM_ITEM_RECORD_FIELD_NAME.IN_TRANSIT_DATE];

    return (
      <AppIcon
        size="small"
        app={APP_ICON_NAME}
      >
        <FormattedTime
          value={get(confirmItem, datePath, DEFAULT_VIEW_VALUE)}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      </AppIcon>
    );
  },
  [CONFIRM_ITEM_RECORD_FIELD_NAME.TITLE]: (confirmItem) => (
    get(confirmItem, CONFIRM_ITEM_RECORD_FIELD_PATH[CONFIRM_ITEM_RECORD_FIELD_NAME.TITLE], DEFAULT_VIEW_VALUE)
  ),
  [CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM_BARCODE]: (confirmItem) => (
    get(confirmItem, CONFIRM_ITEM_RECORD_FIELD_PATH[CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM_BARCODE], DEFAULT_VIEW_VALUE)
  ),

  [CONFIRM_ITEM_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER]: (confirmItem) => {
    const item = get(confirmItem, CONFIRM_ITEM_RECORD_FIELD_PATH[CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM], {});

    return effectiveCallNumber(item);
  },
  [CONFIRM_ITEM_RECORD_FIELD_NAME.MEDIATED_REQUEST_STATUS]: (confirmItem) => (
    get(confirmItem, CONFIRM_ITEM_RECORD_FIELD_PATH[CONFIRM_ITEM_RECORD_FIELD_NAME.MEDIATED_REQUEST_STATUS], DEFAULT_VIEW_VALUE)
  ),
  [CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER]: (confirmItem) => (getRequesterName(confirmItem)),
  [CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER_BARCODE]: (confirmItem) => (
    get(confirmItem, CONFIRM_ITEM_RECORD_FIELD_PATH[CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER_BARCODE], DEFAULT_VIEW_VALUE)
  ),
});
export const getEmptyMessage = (contentData) => (
  contentData.length
    ? null
    : <FormattedMessage id="ui-requests-mediated.confirmItem.mainSection.listItems.isEmptyMessage" />
);

const ConfirmItem = ({
  confirmItemType,
  contentData,
}) => {
  return (
    <MultiColumnList
      id="confirmItemList"
      data-testid="confirmItemList"
      fullWidth
      visibleColumns={CONFIRM_ITEM_COLUMNS_NAME}
      columnWidths={COLUMN_WIDTHS}
      columnMapping={getConfirmItemColumnMapping(confirmItemType)}
      contentData={contentData}
      formatter={getConfirmItemListFormatter(confirmItemType)}
      isEmptyMessage={getEmptyMessage(contentData)}
    />
  );
};

ConfirmItem.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object),
  confirmItemType: PropTypes.oneOf([CONFIRM_ITEM_TYPES.CONFIRM_ITEM_ARRIVAL, CONFIRM_ITEM_TYPES.SEND_ITEM_IN_TRANSIT]).isRequired,
};

export default ConfirmItem;
