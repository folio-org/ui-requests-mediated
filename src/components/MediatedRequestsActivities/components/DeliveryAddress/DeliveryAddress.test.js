import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import DeliveryAddress from './DeliveryAddress';

const basicProps = {
  onChangeAddress: jest.fn(),
  shouldValidate: false,
  deliveryLocations: [
    {
      value: 'value',
      label: 'label',
    }
  ],
};
const labelIds = {
  deliveryAddress: 'ui-requests-mediated.form.request.deliveryAddress',
};
const testIds = {
  deliveryAddress: 'deliveryAddress',
};

describe('DeliveryAddress', () => {
  beforeEach(() => {
    render(
      <DeliveryAddress
        {...basicProps}
      />
    );
  });

  it('should render dropdown label', () => {
    const deliveryAddressLabel = screen.getByText(labelIds.deliveryAddress);

    expect(deliveryAddressLabel).toBeInTheDocument();
  });

  it('should handle address change', () => {
    const event = {
      target: {
        value: 'test',
      },
    };
    const deliveryAddress = screen.getByTestId(testIds.deliveryAddress);

    fireEvent.change(deliveryAddress, event);

    expect(basicProps.onChangeAddress).toHaveBeenCalled();
  });
});
