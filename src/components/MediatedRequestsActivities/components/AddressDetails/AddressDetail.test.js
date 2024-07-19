import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import AddressDetails from './AddressDetails';

const basicProps = {
  address: {
    addressLine1: 'addressLine1',
    city: 'city',
  },
};

describe('AddressDetails', () => {
  beforeEach(() => {
    render(
      <AddressDetails
        {...basicProps}
      />
    );
  });

  it('should render first address name', () => {
    const addressName = screen.getByText(basicProps.address.addressLine1);

    expect(addressName).toBeInTheDocument();
  });

  it('should render city name', () => {
    const cityName = screen.getByText(basicProps.address.city);

    expect(cityName).toBeInTheDocument();
  });
});
