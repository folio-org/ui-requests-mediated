import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { NoValue } from '@folio/stripes/components';

import UserHighlightBox from './UserHighlightBox';

const basicProps = {
  title: 'title',
  name: 'name',
  id: 'id',
  barcode: 'barcode',
};
const labelIds = {
  barcodeLabel: 'ui-requests-mediated.requesterDetails.barcode',
};

jest.mock('../../../../utils', () => ({
  getUserHighlightBoxLink: jest.fn(value => value),
}));

describe('UserHighlightBox', () => {
  describe('When barcode is provided', () => {
    beforeEach(() => {
      render(
        <UserHighlightBox
          {...basicProps}
        />
      );
    });

    it('should render title', () => {
      const title = screen.getByText(basicProps.title);

      expect(title).toBeInTheDocument();
    });

    it('should render barcode label', () => {
      const barcodeLabel = screen.getByText(labelIds.barcodeLabel, {
        exact: false,
      });

      expect(barcodeLabel).toBeInTheDocument();
    });

    it('should render barcode', () => {
      const barcode = screen.getByText(basicProps.barcode, { exact: false });

      expect(barcode).toBeInTheDocument();
    });
  });

  describe('When barcode is not provided', () => {
    const props = {
      ...basicProps,
      barcode: undefined,
    };

    beforeEach(() => {
      render(
        <UserHighlightBox
          {...props}
        />
      );
    });

    it('should trigger NoValue', () => {
      expect(NoValue).toHaveBeenCalled();
    });
  });
});
