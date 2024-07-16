import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

const DeliveryAddress = ({
  onChangeAddress,
  deliveryLocations,
  validate,
}) => {
  return (
    <Field
      name="deliveryAddressTypeId"
      label={<FormattedMessage id="ui-requests.deliveryAddress" />}
      component={Select}
      fullWidth
      onChange={onChangeAddress}
      validate={validate}
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
  validate: PropTypes.func.isRequired,
  deliveryLocations: PropTypes.arrayOf({
    value: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default DeliveryAddress;
