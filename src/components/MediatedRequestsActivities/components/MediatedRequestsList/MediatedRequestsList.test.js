import {
  MemoryRouter,
} from 'react-router-dom';

import {
  render,
} from '@folio/jest-config-stripes/testing-library/react';

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

import MediatedRequestsList, {
  SORT_DIRECTION,
  ASCENDING,
  DESCENDING,
  getSortOrder,
  COLUMN_WIDTHS,
  mediatedRequestsListFormatter,
  emptyMessage,
} from './MediatedRequestsList';

import {
  APP_ICON_NAME,
  DEFAULT_VIEW_VALUE,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME,
  MEDIATED_REQUESTS_RECORD_TRANSLATIONS,
} from '../../../../constants';

const source = {
  totalCount: jest.fn(() => 0),
};
const query = {
  query: '',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useHistory: jest.fn(),
}));

describe('getSortOrder', () => {
  it(`should return ${DESCENDING}`, () => {
    expect(getSortOrder(`${SORT_DIRECTION}requester`)).toEqual(DESCENDING);
  });

  it(`should return ${ASCENDING}`, () => {
    expect(getSortOrder('requester')).toEqual(ASCENDING);
  });
});

describe('MediatedRequestsList', () => {
  const MEDIATED_REQUEST_COLUMNS_NAME = [
    MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE,
    MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE,
    MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE,
    MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER,
    MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS,
    MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER,
    MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE,
  ];
  const contentData = [{}];
  const props = {
    visibleColumns: MEDIATED_REQUEST_COLUMNS_NAME,
    contentData,
    source,
    query,
  };

  beforeEach(() => {
    render(
      <MemoryRouter>
        <MediatedRequestsList {...props} />
      </MemoryRouter>
    );
  });

  it('should render multi column list with correct props', () => {
    const expectedProps = {
      visibleColumns: MEDIATED_REQUEST_COLUMNS_NAME,
      columnWidths: COLUMN_WIDTHS,
      columnMapping: MEDIATED_REQUESTS_RECORD_TRANSLATIONS,
      contentData,
      totalCount: 0,
      formatter: mediatedRequestsListFormatter,
      sortOrder: '',
      sortDirection: 'ascending',
    };

    expect(MultiColumnList).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
  });
});

describe('mediatedRequestsListFormatter', () => {
  const title = 'title value';
  const itemBarcode = 'barcode value';
  const requesterBarcode = 'requester barcode value';
  const requestDate = 'request date value';
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
    requestDate,
    item,
    status,
  };

  describe('title', () => {
    it('should return title', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE](mediatedRequest)).toBe(title);
    });

    it('should return default value for title', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });

  describe('barcode', () => {
    it('should return barcode', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE](mediatedRequest)).toBe(itemBarcode);
    });

    it('should return default value for barcode', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.ITEM_BARCODE]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });

  describe('mediated request date', () => {
    beforeEach(() => {
      render(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.MEDIATED_REQUEST_DATE](mediatedRequest));
    });

    it('should render app icon with correct props', () => {
      expect(AppIcon).toHaveBeenCalledWith(expect.objectContaining({
        size: 'small',
        app: APP_ICON_NAME,
      }), {});
    });

    it('should render formatted time with correct props', () => {
      expect(FormattedTime).toHaveBeenCalledWith(expect.objectContaining({
        value: requestDate,
      }), {});
    });
  });

  describe('effective call number', () => {
    it('should trigger effective call number with correct argument', () => {
      mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.EFFECTIVE_CALL_NUMBER](mediatedRequest);

      expect(effectiveCallNumber).toHaveBeenCalledWith(item);
    });
  });

  describe('status', () => {
    it('should return status', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS](mediatedRequest)).toBe(status);
    });

    it('should return default value for status', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });

  describe('requester', () => {
    it('should return requester', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER](mediatedRequest)).toBe(lastName);
    });

    it('should return default value for requester', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });

  describe('requester barcode', () => {
    it('should return requester barcode', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE](mediatedRequest)).toBe(requesterBarcode);
    });

    it('should return default value for requester barcode', () => {
      expect(mediatedRequestsListFormatter[MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER_BARCODE]()).toBe(DEFAULT_VIEW_VALUE);
    });
  });
});

describe('emptyMessage', () => {
  it('should render search and sort no results message with correct props', () => {
    render(emptyMessage(source, query));

    expect(SearchAndSortNoResultsMessage).toHaveBeenCalledWith(expect.objectContaining({
      filterPaneIsVisible: true,
      searchTerm: query.query,
      source,
    }), {});
  });

  it('should return default value for emptyMessage', () => {
    expect(emptyMessage()).toBeNull();
  });
});
