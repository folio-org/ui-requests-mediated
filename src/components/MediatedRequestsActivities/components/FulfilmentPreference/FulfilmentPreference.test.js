import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import FulfilmentPreference from './FulfilmentPreference';
import DeliveryAddress from '../DeliveryAddress';
import PickupServicePoint from '../PickupServicePoint';
import { REQUEST_TYPES } from '../../../../constants';

jest.mock('../../../../utils', () => ({
  getSelectedAddressTypeId: jest.fn(),
  isDeliverySelected: jest.fn(),
}));
jest.mock('../PickupServicePoint', () => jest.fn(() => <div />));
jest.mock('../DeliveryAddress', () => jest.fn(() => <div />));

const basicProps = {
  isEditForm: false,
  deliverySelected: true,
  deliveryAddress: 'deliveryAddress',
  onChangeAddress: jest.fn(),
  deliveryLocations: [],
  fulfillmentTypeOptions: [
    {
      labelTranslationPath: 'labelTranslationPath',
      value: 'value',
    }
  ],
  defaultDeliveryAddressTypeId: 'defaultId',
  setDeliveryAddress: jest.fn(),
  requestTypes: {
    [REQUEST_TYPES.HOLD]: [
      {
        id: 'id',
        name: 'name',
      }
    ],
  },
  request: {},
  values: {
    requestType: REQUEST_TYPES.HOLD,
  },
  form: {
    change: jest.fn(),
  },
  shouldValidate: false,
};
const labelIds = {
  fulfilmentPreference: 'ui-requests-mediated.form.request.fulfilmentPreference',
};
const testIds = {
  fulfilmentPreference: 'fulfilmentPreference',
};

describe('FulfilmentPreference', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When delivery is selected', () => {
    beforeEach(() => {
      render(
        <FulfilmentPreference
          {...basicProps}
        />
      );
    });

    it('should render fulfilment preference label', () => {
      const fulfilmentPreferenceLabel = screen.getByText(labelIds.fulfilmentPreference);

      expect(fulfilmentPreferenceLabel).toBeInTheDocument();
    });

    it('should render delivery address details', () => {
      const deliveryAddress = screen.getByText(basicProps.deliveryAddress);

      expect(deliveryAddress).toBeInTheDocument();
    });

    it('should trigger DeliveryAddress with correct props', () => {
      const expectedProp = {
        onChangeAddress: expect.any(Function),
        deliveryLocations: basicProps.deliveryLocations,
        shouldValidate: basicProps.shouldValidate,
      };

      expect(DeliveryAddress).toHaveBeenCalledWith(expect.objectContaining(expectedProp), {});
    });

    it('should not trigger PickupServicePoint', () => {
      expect(PickupServicePoint).not.toHaveBeenCalled();
    });

    describe('Fulfilment preference changing', () => {
      const event = {
        target: {
          value: 'test',
        },
      };

      beforeEach(() => {
        const fulfilmentPreferenceSelect = screen.getByTestId(testIds.fulfilmentPreference);

        fireEvent.change(fulfilmentPreferenceSelect, event);
      });

      it('should change fulfilment preference form value', () => {
        expect(basicProps.form.change).toHaveBeenCalled();
      });

      it('should set delivery address', () => {
        expect(basicProps.setDeliveryAddress).toHaveBeenCalled();
      });
    });
  });

  describe('When delivery is not selected', () => {
    const props = {
      ...basicProps,
      deliverySelected: false,
    };

    beforeEach(() => {
      render(
        <FulfilmentPreference
          {...props}
        />
      );
    });

    it('should not render delivery address details', () => {
      const deliveryAddress = screen.queryByText(basicProps.deliveryAddress);

      expect(deliveryAddress).not.toBeInTheDocument();
    });

    it('should trigger PickupServicePoint with correct props', () => {
      const expectedProp = {
        isEditForm: basicProps.isEditForm,
        request: basicProps.request,
        values: basicProps.values,
        requestTypes: basicProps.requestTypes,
        shouldValidate: basicProps.shouldValidate,
      };

      expect(PickupServicePoint).toHaveBeenCalledWith(expect.objectContaining(expectedProp), {});
    });

    it('should not trigger DeliveryAddress', () => {
      expect(DeliveryAddress).not.toHaveBeenCalled();
    });
  });
});
