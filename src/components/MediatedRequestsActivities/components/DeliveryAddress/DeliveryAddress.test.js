import { Field } from 'react-final-form';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { Select } from '@folio/stripes/components';

import DeliveryAddress from './DeliveryAddress';
import { MEDIATED_REQUEST_FORM_FIELD_NAMES } from '../../../../constants';

const basicProps = {
  disabled: false,
  deliveryLocations: [
    {
      value: 'value',
      label: 'label',
    }
  ],
};
const labelIds = {
  deliveryAddress: 'ui-requests-mediated.form.request.delivery',
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

  it('should trigger Field with correct props', () => {
    const expectedProps = {
      name: MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID,
      component: Select,
      disabled: basicProps.disabled,
      fullWidth: true,
    };

    expect(Field).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
  });
});
