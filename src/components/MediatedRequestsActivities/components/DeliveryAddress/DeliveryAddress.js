import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { MEDIATED_REQUEST_FORM_FIELD_NAMES } from '../../../../constants';

const DeliveryAddress = ({
  deliveryLocations,
  disabled,
}) => {
  return (
    <Field
      name={MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID}
      label={<FormattedMessage id="ui-requests-mediated.form.request.delivery" />}
      component={Select}
      disabled={disabled}
      fullWidth
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
  disabled: PropTypes.bool.isRequired,
  deliveryLocations: PropTypes.arrayOf({
    value: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default DeliveryAddress;
