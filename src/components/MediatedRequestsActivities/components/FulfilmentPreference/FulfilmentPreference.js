import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Select,
} from '@folio/stripes/components';

import DeliveryAddress from '../DeliveryAddress';
import PickupServicePoint from '../PickupServicePoint';
import { MEDIATED_REQUEST_FORM_FIELD_NAMES } from '../../../../constants';
import {
  getSelectedAddressTypeId,
  isDeliverySelected,
} from '../../../../utils';

const FulfilmentPreference = ({
  isEditForm,
  deliverySelected = false,
  deliveryAddress = '',
  onChangeAddress,
  deliveryLocations = [],
  fulfillmentTypeOptions = [],
  defaultDeliveryAddressTypeId,
  setDeliveryAddress,
  requestTypes,
  request,
  form,
  values,
  shouldValidate,
}) => {
  const { fulfillmentPreference } = request || {};
  const onChangeFulfillment = (e) => {
    const selectedFulfillmentPreference = e.target.value;
    const isDelivery = isDeliverySelected(selectedFulfillmentPreference);
    const selectedAddressTypeId = getSelectedAddressTypeId(isDelivery, defaultDeliveryAddressTypeId);

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, selectedFulfillmentPreference);
    setDeliveryAddress(isDelivery, selectedAddressTypeId);
  };

  return (
    <>
      <Row>
        <Col
          xsOffset={4}
          xs={4}
        >
          <Field
            data-testid="fulfilmentPreference"
            name={MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE}
            label={<FormattedMessage id="ui-requests-mediated.form.request.fulfilmentPreference" />}
            component={Select}
            value={fulfillmentPreference}
            onChange={onChangeFulfillment}
            fullWidth
          >
            {fulfillmentTypeOptions.map(({
              label,
              value,
            }) => (
              <FormattedMessage
                key={value}
                id={label}
              >
                {translatedLabel => (
                  <option value={value}>
                    {translatedLabel}
                  </option>
                )}
              </FormattedMessage>
            ))}
          </Field>
        </Col>
        <Col xs={4}>
          {
            (!deliverySelected &&
              <PickupServicePoint
                isEditForm={isEditForm}
                request={request}
                values={values}
                requestTypes={requestTypes}
                shouldValidate={shouldValidate}
              />
            ) ||
            (deliveryLocations &&
              <DeliveryAddress
                onChangeAddress={onChangeAddress}
                deliveryLocations={deliveryLocations}
                shouldValidate={shouldValidate}
              />
            )
          }
        </Col>
      </Row>
      {deliverySelected &&
        <Row>
          <Col
            xs={4}
            xsOffset={8}
          >
            {deliveryAddress}
          </Col>
        </Row>
      }
    </>
  );
};

FulfilmentPreference.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  defaultDeliveryAddressTypeId: PropTypes.string.isRequired,
  setDeliveryAddress: PropTypes.func.isRequired,
  requestTypes: PropTypes.object.isRequired,
  request: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  onChangeAddress: PropTypes.func.isRequired,
  shouldValidate: PropTypes.bool.isRequired,
  deliveryAddress: PropTypes.node,
  deliveryLocations: PropTypes.arrayOf(PropTypes.object),
  fulfillmentTypeOptions: PropTypes.arrayOf(PropTypes.object),
  deliverySelected: PropTypes.bool,
};

export default FulfilmentPreference;
