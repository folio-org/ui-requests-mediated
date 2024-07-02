import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import ItemDetail from './ItemDetail';
import { ITEM_STATUSES } from '../../../../constants';

jest.mock('react-router-dom', () => ({
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

const defaultProps = {
  item: {
    barcode: 'itemBarcode',
    id: 'itemId',
    instanceId: 'instanceId',
    holdingsRecordId: 'holdingsRecordId',
    title: 'title',
    contributors: [{ name: 'contributor' }],
    status: {
      name: ITEM_STATUSES.AVAILABLE,
    },
    location: {
      name: 'locationName',
    },
  },
  loan: {
    dueDate: 'dueDate',
  },
  requestCount: 2,
};
const labelIds = {
  itemBarcode: 'ui-requests-mediated.itemDetails.barcode',
  itemTitle: 'ui-requests-mediated.itemDetails.title',
  contributor: 'ui-requests-mediated.itemDetails.contributor',
  effectiveLocation: 'ui-requests-mediated.itemDetails.effectiveLocation',
  callNumber: 'ui-requests-mediated.itemDetails.callNumber',
  status: 'ui-requests-mediated.itemDetails.status',
  availableStatus: 'ui-requests-mediated.item.status.available',
  dueDate: 'ui-requests-mediated.itemDetails.dueDate',
  requestsOnItem: 'ui-requests-mediated.itemDetails.requestsOnItem',
};

describe('ItemDetail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When there is no item information', () => {
    beforeEach(() => {
      render(
        <ItemDetail
          request={{}}
          item={{}}
        />
      );
    });

    it('should not render item barcode label', () => {
      const itemBarcodeLabel = screen.queryByText(labelIds.itemBarcode);

      expect(itemBarcodeLabel).not.toBeInTheDocument();
    });
  });

  describe('When there is item information', () => {
    beforeEach(() => {
      render(
        <ItemDetail
          {...defaultProps}
        />
      );
    });

    it('should render barcode label', () => {
      const barcodeLabel = screen.getByText(labelIds.itemBarcode);

      expect(barcodeLabel).toBeInTheDocument();
    });

    it('should render barcode value', () => {
      const barcodeValue = screen.getByText(defaultProps.item.barcode, {
        exact: false,
      });

      expect(barcodeValue).toBeInTheDocument();
    });

    it('should render title label', () => {
      const titleLabel = screen.getByText(labelIds.itemTitle);

      expect(titleLabel).toBeInTheDocument();
    });

    it('should render title value', () => {
      const titleValue = screen.getByText(defaultProps.item.title);

      expect(titleValue).toBeInTheDocument();
    });

    it('should render contributor label', () => {
      const contributorLabel = screen.getByText(labelIds.contributor);

      expect(contributorLabel).toBeInTheDocument();
    });

    it('should render contributor value', () => {
      const contributorValue = screen.getByText(defaultProps.item.contributors[0].name);

      expect(contributorValue).toBeInTheDocument();
    });

    it('should render effective location label', () => {
      const effectiveLocationLabel = screen.getByText(labelIds.effectiveLocation);

      expect(effectiveLocationLabel).toBeInTheDocument();
    });

    it('should render effective location value', () => {
      const effectiveLocationValue = screen.getByText(defaultProps.item.location.name);

      expect(effectiveLocationValue).toBeInTheDocument();
    });

    it('should render call number label', () => {
      const callNumberLabel = screen.getByText(labelIds.callNumber);

      expect(callNumberLabel).toBeInTheDocument();
    });

    it('should render call number value', () => {
      const callNumberValue = screen.getByText('effectiveCallNumber');

      expect(callNumberValue).toBeInTheDocument();
    });

    it('should render status label', () => {
      const statusLabel = screen.getByText(labelIds.status);

      expect(statusLabel).toBeInTheDocument();
    });

    it('should render status value', () => {
      const statusValue = screen.getByText(labelIds.availableStatus);

      expect(statusValue).toBeInTheDocument();
    });

    it('should render due date label', () => {
      const dueDateLabel = screen.getByText(labelIds.dueDate);

      expect(dueDateLabel).toBeInTheDocument();
    });

    it('should render due date value', () => {
      const dueDateValue = screen.getByText(defaultProps.loan.dueDate);

      expect(dueDateValue).toBeInTheDocument();
    });

    it('should render requests on item label', () => {
      const requestsOnItemLabel = screen.getByText(labelIds.requestsOnItem);

      expect(requestsOnItemLabel).toBeInTheDocument();
    });

    it('should render requests on item value', () => {
      const requestsOnItemValue = screen.getByText(defaultProps.requestCount);

      expect(requestsOnItemValue).toBeInTheDocument();
    });
  });
});
