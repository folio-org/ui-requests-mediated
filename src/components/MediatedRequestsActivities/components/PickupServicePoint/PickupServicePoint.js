import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

const PickupServicePoint = ({
  isEditForm,
  request,
  values,
  requestTypes,
  validate,
}) => {
  const selectedRequestType = isEditForm ? request.requestType : values.requestType;
  const allowedServicePoints = requestTypes[selectedRequestType] || [];

  return (
    <Field
      data-testid="pickupServicePoint"
      name="pickupServicePointId"
      validateFields={[]}
      validate={validate}
    >
      {
        ({
           input,
           meta
         }) => {
          const error = meta.touched && meta.error;

          return (
            <Select
              {...input}
              label={<FormattedMessage id="ui-requests-mediated.form.request.pickupServicePoint" />}
              error={error}
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
  isEditForm: PropTypes.bool.isRequired,
  requestTypes: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  validate: PropTypes.func.isRequired,
  request: PropTypes.object.isRequired,
};

export default PickupServicePoint;
