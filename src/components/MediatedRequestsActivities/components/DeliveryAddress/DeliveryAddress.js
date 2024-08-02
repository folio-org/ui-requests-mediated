import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { validateDropDownValue } from '../../../../utils';

const DeliveryAddress = ({
  onChangeAddress,
  deliveryLocations,
  shouldValidate,
}) => {
  return (
    <Field
      name="deliveryAddressTypeId"
      data-testid="deliveryAddress"
      label={<FormattedMessage id="ui-requests-mediated.form.request.delivery" />}
      component={Select}
      fullWidth
      onChange={onChangeAddress}
      validate={validateDropDownValue(shouldValidate)}
    >
      {deliveryLocations.map(({
        value,
        label,
      }) => (
        <option
          key={value}
          value={value}
        >
          {label}
        </option>
      ))}
    </Field>
  );
};

DeliveryAddress.propTypes = {
  onChangeAddress: PropTypes.func.isRequired,
  shouldValidate: PropTypes.bool.isRequired,
  deliveryLocations: PropTypes.arrayOf({
    value: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default DeliveryAddress;
