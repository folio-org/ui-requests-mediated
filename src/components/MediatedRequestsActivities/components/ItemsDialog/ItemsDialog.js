import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  countBy,
} from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Modal,
  MultiColumnList,
  Pane,
  Paneset,
  Loading,
  Layout,
} from '@folio/stripes/components';

import {
  ITEM_STATUSES,
  ITEM_STATUS_TRANSLATIONS,
} from '../../../../constants';
import { useCirculationRequests } from '../../../../hooks';

import css from './ItemsDialog.css';

export const COLUMN_NAMES = [
  'barcode',
  'itemStatus',
  'requestQueue',
  'location',
  'materialType',
  'loanType',
];
export const COLUMN_WIDTHS = {
  barcode: '16%',
  itemStatus: '16%',
  requestQueue: '16%',
  location: '16%',
  materialType: '16%',
  loanType: '16%',
};
export const COLUMN_MAP = {
  barcode: <FormattedMessage id="ui-requests-mediated.itemsDialog.barcode" />,
  itemStatus: <FormattedMessage id="ui-requests-mediated.itemsDialog.status" />,
  requestQueue: <FormattedMessage id="ui-requests-mediated.itemsDialog.requestQueue" />,
  location: <FormattedMessage id="ui-requests-mediated.itemsDialog.location" />,
  materialType: <FormattedMessage id="ui-requests-mediated.itemsDialog.materialType" />,
  loanType: <FormattedMessage id="ui-requests-mediated.itemsDialog.loanType" />,
};
export const formatter = {
  itemStatus: item => <FormattedMessage id={ITEM_STATUS_TRANSLATIONS[item.status.name]} />,
  location: item => get(item, 'location.name', ''),
  materialType: item => item.materialType.name,
  loanType: item => (item.temporaryLoanType ? get(item, 'temporaryLoanType.name', '') : get(item, 'permanentLoanType.name', '')),
};
export const MAX_HEIGHT = 500;

const ItemsDialog = ({
  onClose,
  open,
  onRowClick,
  title,
  instanceId,
}) => {
  const {
    data,
    isFetching,
  } = useCirculationRequests(instanceId, open);
  const contentData = useMemo(() => {
    if (data?.itemsList) {
      const requestMap = countBy(data.requests, 'itemId');

      // items with status available must go first
      return data.itemsList
        .sort((item) => (item.status.name === ITEM_STATUSES.AVAILABLE ? -1 : 1))
        .map(item => ({
          ...item,
          requestQueue: requestMap[item.id] || 0,
        }));
    }

    return [];
  }, [data]);

  const itemsAmount = contentData.length;

  return (
    <Modal
      label={<FormattedMessage id="ui-requests-mediated.itemsDialog.selectItem" />}
      open={open}
      contentClass={css.content}
      onClose={onClose}
      dismissible
    >
      <Paneset
        id="itemsDialog"
        isRoot
        static
      >
        <Pane
          paneTitle={
            <FormattedMessage
              id="ui-requests-mediated.itemsDialog.instanceItems"
              values={{ title }}
            />
          }
          paneSub={
            <FormattedMessage
              id="ui-requests-mediated.itemsDialog.resultCount"
              values={{ count: itemsAmount }}
            />
          }
          defaultWidth="fill"
        >
          {isFetching ?
            <Layout
              data-testid="loading"
              className="display-flex centerContent"
            >
              <Loading size="large" />
            </Layout> :
            <MultiColumnList
              id="instanceItemsList"
              contentData={contentData}
              visibleColumns={COLUMN_NAMES}
              columnMapping={COLUMN_MAP}
              columnWidths={COLUMN_WIDTHS}
              formatter={formatter}
              maxHeight={MAX_HEIGHT}
              isEmptyMessage={<FormattedMessage id="ui-requests-mediated.itemsDialog.noItems" />}
              onRowClick={onRowClick}
              interactive
            />
          }
        </Pane>
      </Paneset>
    </Modal>
  );
};

ItemsDialog.defaultProps = {
  title: '',
};

ItemsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  instanceId: PropTypes.string,
  onRowClick: PropTypes.func,
};

export default ItemsDialog;
