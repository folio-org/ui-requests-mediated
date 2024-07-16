import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { validateDropDownValue } from '../../../../utils';

const PickupServicePoint = ({
  isEditForm,
  request,
  values,
  requestTypes,
  shouldValidate,
}) => {
  const selectedRequestType = isEditForm ? request.requestType : values.requestType;
  const allowedServicePoints = requestTypes[selectedRequestType] || [];

  return (
    <Field
      data-testid="pickupServicePoint"
      name="pickupServicePointId"
      validateFields={[]}
      validate={validateDropDownValue(shouldValidate)}
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
  shouldValidate: PropTypes.bool.isRequired,
  request: PropTypes.object.isRequired,
};

export default PickupServicePoint;
