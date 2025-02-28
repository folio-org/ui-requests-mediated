import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  Modal,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import {
  ITEM_STATUS_TRANSLATION_KEYS,
  ITEM_STATUSES,
} from '../../../../constants';
import ItemsDialog, {
  COLUMN_NAMES,
  COLUMN_WIDTHS,
  COLUMN_MAP,
  formatter,
  MAX_HEIGHT,
} from './ItemsDialog';
import { useAvailableItems } from '../../../../hooks';

jest.mock('../../../../hooks', () => ({
  useAvailableItems: jest.fn(),
}));

const testIds = {
  loading: 'loading',
};
const labelIds = {
  selectItem: 'ui-requests-mediated.itemsDialog.selectItem',
  instanceItems: 'ui-requests-mediated.itemsDialog.instanceItems',
  resultCount: 'ui-requests-mediated.itemsDialog.resultCount',
  instanceItemsNotFound: 'ui-requests-mediated.itemsDialog.noItems',
};
const basicProps = {
  open: true,
  onClose: jest.fn(),
  onRowClick: jest.fn(),
  instanceId: 'instanceId',
  title: 'title',
};

describe('ItemsDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When data loading', () => {
    beforeEach(() => {
      useAvailableItems.mockReturnValueOnce({
        data: {},
        isFetching: true,
      });
      render(
        <ItemsDialog
          {...basicProps}
        />
      );
    });

    it('should trigger modal window with correct props', () => {
      const expectedProps = {
        open: basicProps.open,
        onClose: basicProps.onClose,
        dismissible: true,
      };

      expect(Modal).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should render modal label', () => {
      const modalLabel = screen.getByText(labelIds.selectItem);

      expect(modalLabel).toBeInTheDocument();
    });

    it('should render pane title', () => {
      const paneTitle = screen.getByText(labelIds.instanceItems);

      expect(paneTitle).toBeInTheDocument();
    });

    it('should render pane sub title', () => {
      const paneSubTitle = screen.getByText(labelIds.resultCount);

      expect(paneSubTitle).toBeInTheDocument();
    });

    it('should render loading spinner', () => {
      const spinner = screen.getByTestId(testIds.loading);

      expect(spinner).toBeInTheDocument();
    });
  });

  describe('When data loaded', () => {
    const data = {
      items: [
        {
          id: 'itemId',
          status: {
            name: ITEM_STATUSES.AVAILABLE,
          },
        },
        {
          id: 'itemId_2',
          status: {
            name: ITEM_STATUSES.AGED_TO_LOST,
          },
        }
      ],
      requests: [{ itemId: 'itemId' }],
    };

    beforeEach(() => {
      useAvailableItems.mockReturnValueOnce({
        isFetching: false,
        data,
      });
      render(
        <ItemsDialog
          {...basicProps}
        />
      );
    });

    it('should trigger MultiColumnList with correct props', () => {
      const expectedProps = {
        id: 'instanceItemsList',
        contentData: [
          {
            id: 'itemId',
            status: {
              name: ITEM_STATUSES.AVAILABLE,
            },
          },
          {
            id: 'itemId_2',
            status: {
              name: ITEM_STATUSES.AGED_TO_LOST,
            },
          }
        ],
        visibleColumns: COLUMN_NAMES,
        columnMapping: COLUMN_MAP,
        columnWidths: COLUMN_WIDTHS,
        formatter,
        maxHeight: MAX_HEIGHT,
        onRowClick: basicProps.onRowClick,
        interactive: true,
      };

      expect(MultiColumnList).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('formatter', () => {
    const item = {
      barcode: 'barcode',
      status: {
        name: ITEM_STATUSES.AGED_TO_LOST,
      },
      location: {
        name: 'location',
      },
      materialType: {
        name: 'materialType',
      },
      temporaryLoanType: {
        name: 'temporaryLoanType',
      },
    };

    describe('barcode', () => {
      it('should return item barcode', () => {
        expect(formatter.barcode(item)).toBe(item.barcode);
      });

      it('should return default value', () => {
        expect(formatter.barcode()).toEqual(<NoValue />);
      });
    });

    describe('itemStatus', () => {
      it('should return formatted message', () => {
        expect(formatter.itemStatus(item).props.id).toBe(ITEM_STATUS_TRANSLATION_KEYS[[ITEM_STATUSES.AGED_TO_LOST]]);
      });
    });

    describe('location', () => {
      it('should return location name', () => {
        expect(formatter.location(item)).toBe(item.location.name);
      });

      it('should return default value', () => {
        expect(formatter.location()).toEqual(<NoValue />);
      });
    });

    describe('materialType', () => {
      it('should return material type', () => {
        expect(formatter.materialType(item)).toBe(item.materialType.name);
      });
    });

    describe('loanType', () => {
      describe('With temporaryLoanType', () => {
        it('should return temporary loan type name', () => {
          expect(formatter.loanType(item)).toBe(item.temporaryLoanType.name);
        });

        it('should return default value', () => {
          const itemWithoutLoanType = {
            temporaryLoanType: {},
          };

          expect(formatter.loanType(itemWithoutLoanType)).toEqual(<NoValue />);
        });
      });

      describe('Without temporaryLoanType', () => {
        it('should return permanent loan type name', () => {
          const itemWithPermanentLoanType = {
            ...item,
            temporaryLoanType: undefined,
            permanentLoanType: {
              name: 'permanentLoanType',
            },
          };

          expect(formatter.loanType(itemWithPermanentLoanType)).toBe(itemWithPermanentLoanType.permanentLoanType.name);
        });

        it('should return default value', () => {
          const itemWithoutLoanType = {
            permanentLoanType: {},
          };

          expect(formatter.loanType(itemWithoutLoanType)).toEqual(<NoValue />);
        });
      });
    });
  });
});
