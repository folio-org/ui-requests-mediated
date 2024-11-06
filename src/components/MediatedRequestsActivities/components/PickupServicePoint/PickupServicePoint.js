import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { MEDIATED_REQUEST_FORM_FIELD_NAMES } from '../../../../constants';

const PickupServicePoint = ({
  values,
  requestTypes,
  disabled,
}) => {
  const allowedServicePoints = requestTypes[values?.requestType] || [];

  return (
    <Field
      data-testid="pickupServicePoint"
      name={MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID}
    >
      {
        ({
          input,
        }) => {
          return (
            <Select
              {...input}
              label={<FormattedMessage id="ui-requests-mediated.form.request.pickupServicePoint" />}
              disabled={disabled}
              fullWidth
            >
              <FormattedMessage id="ui-requests-mediated.form.request.selectServicePoint">
                {optionLabel => <option value="">{optionLabel}</option>}
              </FormattedMessage>
              {allowedServicePoints.map(({
                id,
                name,
              }) => (
                <option
                  key={id}
                  value={id}
                >
                  {name}
                </option>
              ))}
            </Select>
          );
        }
      }
    </Field>
  );
};

PickupServicePoint.propTypes = {
  requestTypes: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default PickupServicePoint;
