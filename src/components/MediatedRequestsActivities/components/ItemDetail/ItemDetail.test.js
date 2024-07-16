import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import ItemDetail from './ItemDetail';
import { ITEM_STATUSES } from '../../../../constants';

jest.mock('react-router-dom', () => ({
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

const basicProps = {
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
          {...basicProps}
        />
      );
    });

    it('should render barcode label', () => {
      const barcodeLabel = screen.getByText(labelIds.itemBarcode);

      expect(barcodeLabel).toBeInTheDocument();
    });

    it('should render barcode value', () => {
      const barcodeValue = screen.getByText(basicProps.item.barcode, {
        exact: false,
      });

      expect(barcodeValue).toBeInTheDocument();
    });

    it('should render title label', () => {
      const titleLabel = screen.getByText(labelIds.itemTitle);

      expect(titleLabel).toBeInTheDocument();
    });

    it('should render title value', () => {
      const titleValue = screen.getByText(basicProps.item.title);

      expect(titleValue).toBeInTheDocument();
    });

    it('should render contributor label', () => {
      const contributorLabel = screen.getByText(labelIds.contributor);

      expect(contributorLabel).toBeInTheDocument();
    });

    it('should render contributor value', () => {
      const contributorValue = screen.getByText(basicProps.item.contributors[0].name);

      expect(contributorValue).toBeInTheDocument();
    });

    it('should render effective location label', () => {
      const effectiveLocationLabel = screen.getByText(labelIds.effectiveLocation);

      expect(effectiveLocationLabel).toBeInTheDocument();
    });

    it('should render effective location value', () => {
      const effectiveLocationValue = screen.getByText(basicProps.item.location.name);

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
      const dueDateValue = screen.getByText(basicProps.loan.dueDate);

      expect(dueDateValue).toBeInTheDocument();
    });
  });
});
