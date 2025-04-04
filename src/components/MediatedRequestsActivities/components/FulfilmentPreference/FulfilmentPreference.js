import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Select,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import DeliveryAddress from '../DeliveryAddress';
import PickupServicePoint from '../PickupServicePoint';
import {
  MEDIATED_REQUEST_FORM_FIELD_NAMES,
  REQUEST_PROP_TYPES,
  MEDIATED_REQUEST_TYPES,
} from '../../../../constants';
import { isDelivery } from '../../../../utils';

const FulfilmentPreference = ({
  isDeliverySelected = false,
  deliveryAddress = '',
  deliveryLocations = [],
  fulfillmentTypeOptions = [],
  setDeliveryAddress,
  requestTypes,
  request,
  form,
  values,
}) => {
  const stripes = useStripes();
  const isEditPermission = stripes.hasPerm('ui-requests-mediated.requests-mediated.view-create-edit.execute');
  const { fulfillmentPreference } = request || {};
  const onChangeFulfillment = (e) => {
    const selectedFulfillmentPreference = e.target.value;
    const isDeliveryFulfilmentPreference = isDelivery(selectedFulfillmentPreference);

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, selectedFulfillmentPreference);
    setDeliveryAddress(isDeliveryFulfilmentPreference);
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
            disabled={!isEditPermission}
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
            isDeliverySelected ?
              <DeliveryAddress
                deliveryLocations={deliveryLocations}
                disabled={!isEditPermission}
              /> :
              <PickupServicePoint
                values={values}
                requestTypes={requestTypes}
                disabled={!isEditPermission}
              />
          }
        </Col>
      </Row>
      {isDeliverySelected &&
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
  setDeliveryAddress: PropTypes.func.isRequired,
  requestTypes: PropTypes.shape({
    [MEDIATED_REQUEST_TYPES.RECALL]: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })),
    [MEDIATED_REQUEST_TYPES.HOLD]: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })),
    [MEDIATED_REQUEST_TYPES.PAGE]: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    })),
  }).isRequired,
  request: REQUEST_PROP_TYPES,
  form: PropTypes.shape({
    change: PropTypes.func.isRequired,
  }).isRequired,
  values: PropTypes.shape({
    requestType: PropTypes.string,
  }).isRequired,
  deliveryAddress: PropTypes.node,
  deliveryLocations: PropTypes.arrayOf({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  fulfillmentTypeOptions: PropTypes.arrayOf({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  isDeliverySelected: PropTypes.bool,
};

export default FulfilmentPreference;
