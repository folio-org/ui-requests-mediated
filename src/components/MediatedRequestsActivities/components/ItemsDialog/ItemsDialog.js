import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
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
  ITEM_STATUS_TRANSLATION_KEYS,
} from '../../../../constants';
import { useAvailableItems } from '../../../../hooks';

import css from './ItemsDialog.css';

export const COLUMN_NAMES = [
  'barcode',
  'itemStatus',
  'location',
  'materialType',
  'loanType',
];
export const COLUMN_WIDTHS = {
  barcode: '20%',
  itemStatus: '20%',
  location: '20%',
  materialType: '20%',
  loanType: '20%',
};
export const COLUMN_MAP = {
  barcode: <FormattedMessage id="ui-requests-mediated.itemsDialog.barcode" />,
  itemStatus: <FormattedMessage id="ui-requests-mediated.itemsDialog.status" />,
  location: <FormattedMessage id="ui-requests-mediated.itemsDialog.location" />,
  materialType: <FormattedMessage id="ui-requests-mediated.itemsDialog.materialType" />,
  loanType: <FormattedMessage id="ui-requests-mediated.itemsDialog.loanType" />,
};
export const formatter = {
  itemStatus: item => <FormattedMessage id={ITEM_STATUS_TRANSLATION_KEYS[item.status.name]} />,
  location: item => get(item, 'location.name', ''),
  materialType: item => item.materialType.name,
  loanType: item => (item.temporaryLoanType ? get(item, 'temporaryLoanType.name', '') : get(item, 'permanentLoanType.name', '')),
};
export const MAX_HEIGHT = 500;

const ItemsDialog = ({
  onClose,
  open,
  onRowClick,
  title = '',
  instanceId,
}) => {
  const {
    data: itemsList,
    isFetching,
  } = useAvailableItems(instanceId, open);
  const contentData = useMemo(() => {
    if (itemsList?.items) {
      // items with status available must go first
      return itemsList?.items.sort((item) => (item.status.name === ITEM_STATUSES.AVAILABLE ? -1 : 1));
    }

    return [];
  }, [itemsList]);

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

ItemsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  instanceId: PropTypes.string,
  onRowClick: PropTypes.func,
};

export default ItemsDialog;
