import {
  MemoryRouter,
} from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  AppIcon,
} from '@folio/stripes/core';
import {
  MultiColumnList,
  FormattedTime,
} from '@folio/stripes/components';
import {
  effectiveCallNumber,
} from '@folio/stripes/util';

import ConfirmItemList, {
  COLUMN_WIDTHS,
  getConfirmItemColumnMapping,
  getConfirmItemListFormatter,
  getEmptyMessage,
} from './ConfirmItemList';

import {
  APP_ICON_NAME,
  CONFIRM_ITEM_TYPES,
  CONFIRM_ITEM_RECORD_FIELD_NAME,
  DEFAULT_VIEW_VALUE,
} from '../../../constants';

const contentData = [];
const props = {
  confirmItemType: CONFIRM_ITEM_TYPES.CONFIRM_ITEM_ARRIVAL,
  contentData,
};
const labelIds = {
  isEmptyMessage: 'ui-requests-mediated.confirmItem.mainSection.listItems.isEmptyMessage',
};

describe('ConfirmItemList', () => {
  const MEDIATED_REQUEST_COLUMNS_NAME = [
    CONFIRM_ITEM_RECORD_FIELD_NAME.DATE,
    CONFIRM_ITEM_RECORD_FIELD_NAME.TITLE,
    CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM_BARCODE,
    CONFIRM_ITEM_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER,
    CONFIRM_ITEM_RECORD_FIELD_NAME.MEDIATED_REQUEST_STATUS,
    CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER,
    CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER_BARCODE,
  ];


  beforeEach(() => {
    render(
      <MemoryRouter>
        <ConfirmItemList {...props} />
      </MemoryRouter>
    );
  });

  it('should render multi column list with correct props', () => {
    const expectedProps = {
      visibleColumns: MEDIATED_REQUEST_COLUMNS_NAME,
      columnWidths: COLUMN_WIDTHS,
      columnMapping: getConfirmItemColumnMapping(props.confirmItemType),
      contentData,
    };

    expect(MultiColumnList).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
  });
});

describe('getConfirmItemListFormatter', () => {
  const title = 'title value';
  const itemBarcode = 'barcode value';
  const requesterBarcode = 'requester barcode value';
  const arrivalDate = 'request date value';
  const lastName = 'last name value';
  const item = {
    barcode: itemBarcode,
  };
  const status = 'status value';
  const mediatedRequest = {
    instance: {
      title,
    },
    requester: {
      lastName,
      barcode: requesterBarcode,
    },
    arrivalDate,
    item,
    mediatedRequest: {
      status,
    },
  };

  describe('title', () => {
    it('should return title', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.TITLE](mediatedRequest)).toBe(title);
    });

    it('should return default value for title', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.TITLE]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });

  describe('barcode', () => {
    it('should return barcode', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM_BARCODE](mediatedRequest)).toBe(itemBarcode);
    });

    it('should return default value for barcode', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.ITEM_BARCODE]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });

  describe('mediated request date', () => {
    beforeEach(() => {
      render(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.DATE](mediatedRequest));
    });

    it('should render app icon with correct props', () => {
      expect(AppIcon).toHaveBeenCalledWith(expect.objectContaining({
        size: 'small',
        app: APP_ICON_NAME,
      }), {});
    });

    it('should render formatted time with correct props', () => {
      expect(FormattedTime).toHaveBeenCalledWith(expect.objectContaining({
        value: arrivalDate,
      }), {});
    });
  });

  describe('effective call number', () => {
    it('should trigger effective call number with correct argument', () => {
      getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER](mediatedRequest);

      expect(effectiveCallNumber).toHaveBeenCalledWith(item);
    });
  });

  describe('status', () => {
    it('should return status', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.MEDIATED_REQUEST_STATUS](mediatedRequest)).toBe(status);
    });

    it('should return default value for status', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.MEDIATED_REQUEST_STATUS]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });

  describe('requester', () => {
    it('should return requester', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER](mediatedRequest)).toBe(lastName);
    });

    it('should return default value for requester', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });

  describe('requester barcode', () => {
    it('should return requester barcode', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER_BARCODE](mediatedRequest)).toBe(requesterBarcode);
    });

    it('should return default value for requester barcode', () => {
      expect(getConfirmItemListFormatter(props.confirmItemType)[CONFIRM_ITEM_RECORD_FIELD_NAME.REQUESTER_BARCODE]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });
});

describe('getEmptyMessage', () => {
  it('should render search and sort no results message with correct props', () => {
    render(getEmptyMessage([]));

    const requestLevelLabel = screen.getByText(labelIds.isEmptyMessage);

    expect(requestLevelLabel).toBeInTheDocument();
  });

  it('should return default value for getEmptyMessage', () => {
    expect(getEmptyMessage([{}])).toBeNull();
  });
});
