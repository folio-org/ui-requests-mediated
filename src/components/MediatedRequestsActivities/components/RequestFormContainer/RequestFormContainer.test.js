import { useHistory } from 'react-router-dom';

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKy,
  useCallout,
} from '@folio/stripes/core';

import RequestFormContainer, {
  urls,
} from './RequestFormContainer';
import RequestForm from '../RequestForm';
import {
  MEDIATED_REQUESTS_ACTIVITIES,
  MODULE_ROUTE,
  ITEM_QUERIES,
  RESOURCE_KEYS,
  RESOURCE_TYPES,
  DEFAULT_REQUEST_TYPE_VALUE,
  FULFILMENT_TYPES,
  MEDIATED_REQUEST_LEVEL,
  MEDIATED_REQUEST_TYPES,
  SAVE_BUTTON_ID,
} from '../../../../constants';

const basicProps = {
  request: {},
  settings: {
    items: [
      {
        value: {
          createTitleLevelRequestsByDefault: false,
        },
      }
    ],
  },
  patronGroups: [],
};
const testIds = {
  cancelButton: 'cancelButton',
  findDataButton: 'findDataButton',
  submitButton: 'submitButton',
};
const addressTypes = [];

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));
jest.mock('query-string', () => ({
  stringify: jest.fn(({ query }) => `query=${query}`),
}));
jest.mock('../../../../hooks/useAddressTypes', () => jest.fn(() => ({
  addressTypes,
})));
jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  getInstanceQueryString: jest.fn(query => query),
}));
jest.mock('../RequestForm', () => jest.fn(({
  onCancel,
  findResource,
}) => {
  const findItem = () => {
    findResource('item', 'test');
  };

  return (
    <>
      <button
        type="button"
        data-testid={testIds.cancelButton}
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        data-testid={testIds.findDataButton}
        onClick={findItem}
      >
        Find Data
      </button>
    </>
  );
}));

const mockedProxy = {
  personal: {
    firstName: 'proxyFirstName',
    lastName: 'proxyLastName',
  },
};
const mockSubmitFunctionality = (dataToSubmit, isSavingRequest, isProxy) => {
  RequestForm.mockImplementation(({
    onSubmit,
    onSetSubmitInitiator,
    onSetSelectedProxy,
  }) => {
    if (isSavingRequest) {
      onSetSubmitInitiator(SAVE_BUTTON_ID);
    }

    if (isProxy) {
      onSetSelectedProxy(mockedProxy);
    }

    const submitData = () => {
      onSubmit(dataToSubmit);
    };

    return (
      <form>
        <button
          type="button"
          data-testid={testIds.submitButton}
          onClick={submitData}
        >
          Submit
        </button>
      </form>
    );
  });

  render(
    <RequestFormContainer
      {...basicProps}
    />
  );

  const submitButton = screen.getByTestId(testIds.submitButton);

  fireEvent.click(submitButton);
};

describe('RequestFormContainer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component', () => {
    describe('Initial render', () => {
      const history = {
        push: jest.fn(),
      };

      beforeEach(() => {
        useHistory.mockReturnValue(history);

        render(
          <RequestFormContainer
            {...basicProps}
          />
        );
      });

      it('should trigger RequestForm with correct props', () => {
        const expectedProps = {
          request: basicProps.request,
          settings: basicProps.settings,
          patronGroups: basicProps.patronGroups,
          initialValues: {
            requestType: DEFAULT_REQUEST_TYPE_VALUE,
            fulfillmentPreference: FULFILMENT_TYPES.HOLD_SHELF,
            createTitleLevelRequest: basicProps.settings.items[0].value.createTitleLevelRequestsByDefault,
          },
          onSetSelectedItem: expect.any(Function),
          onSetSelectedUser: expect.any(Function),
          onSetSelectedInstance: expect.any(Function),
          findResource: expect.any(Function),
          onSubmit: expect.any(Function),
          onCancel: expect.any(Function),
          onSetSubmitInitiator: expect.any(Function),
          onSetSelectedProxy: expect.any(Function),
          addressTypes,
        };

        expect(RequestForm).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
      });

      it('should cancel request creation', () => {
        const cancelButton = screen.getByTestId(testIds.cancelButton);
        const homeUrl = `/${MODULE_ROUTE}/${MEDIATED_REQUESTS_ACTIVITIES}`;

        fireEvent.click(cancelButton);

        expect(history.push).toHaveBeenCalledWith(homeUrl);
      });

      it('should find item data', () => {
        const findDataButton = screen.getByTestId(testIds.findDataButton);
        const itemUrl = `circulation/items-by-instance?query=(${ITEM_QUERIES[RESOURCE_KEYS.ID]}=="test")`;

        fireEvent.click(findDataButton);

        expect(useOkapiKy().get).toHaveBeenCalledWith(itemUrl);
      });
    });

    describe('Data submitting', () => {
      const basicDataToSend = {
        itemId: 'itemId',
        item: {},
        createTitleLevelRequest: false,
        keyOfItemBarcodeField: 1,
        keyOfUserBarcodeField: 1,
        keyOfRequestTypeField: 1,
        pickupServicePointId: 'pickupServicePointId',
        deliveryAddressTypeId: '',
        requester: {
          personal: {
            firstName: 'firstName',
            lastName: 'lastName',
          },
        },
        requestType: MEDIATED_REQUEST_TYPES.HOLD,
      };

      describe('When fulfilment preference is hold shelf', () => {
        const dataToSubmit = {
          ...basicDataToSend,
          fulfillmentPreference: FULFILMENT_TYPES.HOLD_SHELF,
          requestLevel: MEDIATED_REQUEST_LEVEL.ITEM,
        };

        beforeEach(() => {
          mockSubmitFunctionality(dataToSubmit);
        });

        it('should send correct data to save', () => {
          const expectedArguments = [
            'circulation-bff/mediated-requests/confirm',
            {
              json: expect.objectContaining({
                itemId: basicDataToSend.itemId,
                item: basicDataToSend.item,
                pickupServicePointId: basicDataToSend.pickupServicePointId,
                requestDate: expect.any(String),
                requestLevel: MEDIATED_REQUEST_LEVEL.ITEM,
                fulfillmentPreference: FULFILMENT_TYPES.HOLD_SHELF,
              }),
            }
          ];

          expect(useOkapiKy().post).toHaveBeenCalledWith(...expectedArguments);
        });

        it('should send callout', async () => {
          await waitFor(() => {
            expect(useCallout().sendCallout).toHaveBeenCalled();
          });
        });
      });

      describe('When fulfilment preference is delivery', () => {
        const dataToSubmit = {
          ...basicDataToSend,
          fulfillmentPreference: FULFILMENT_TYPES.DELIVERY,
          requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
          createTitleLevelRequest: true,
          deliveryAddressTypeId: 'deliveryAddressTypeId',
          pickupServicePointId: '',
        };

        beforeEach(() => {
          mockSubmitFunctionality(dataToSubmit);
        });

        it('should send correct data to save', () => {
          const expectedArguments = [
            'circulation-bff/mediated-requests/confirm',
            {
              json: expect.objectContaining({
                deliveryAddressTypeId: dataToSubmit.deliveryAddressTypeId,
                requestDate: expect.any(String),
                requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
                fulfillmentPreference: FULFILMENT_TYPES.DELIVERY,
              }),
            }
          ];

          expect(useOkapiKy().post).toHaveBeenCalledWith(...expectedArguments);
        });

        it('should send callout', async () => {
          await waitFor(() => {
            expect(useCallout().sendCallout).toHaveBeenCalled();
          });
        });
      });

      describe('When request type is not provided', () => {
        const dataToSubmit = {
          ...basicDataToSend,
          requestType: undefined,
          requestLevel: MEDIATED_REQUEST_LEVEL.ITEM,
        };

        beforeEach(() => {
          mockSubmitFunctionality(dataToSubmit);
        });

        it('should send correct data to save', () => {
          const expectedArguments = [
            'circulation-bff/mediated-requests/confirm',
            {
              json: expect.objectContaining({
                itemId: basicDataToSend.itemId,
                item: basicDataToSend.item,
                requestDate: expect.any(String),
                requestLevel: MEDIATED_REQUEST_LEVEL.ITEM,
              }),
            }
          ];

          expect(useOkapiKy().post).toHaveBeenCalledWith(...expectedArguments);
        });
      });

      describe('When request saving for proxy user', () => {
        const dataToSubmit = {
          ...basicDataToSend,
          requestLevel: MEDIATED_REQUEST_LEVEL.ITEM,
        };

        beforeEach(() => {
          mockSubmitFunctionality(dataToSubmit, true, true);
        });

        it('should send correct data to save', () => {
          const expectedArguments = [
            'requests-mediated/mediated-requests',
            {
              json: expect.objectContaining({
                itemId: basicDataToSend.itemId,
                item: basicDataToSend.item,
                requestDate: expect.any(String),
                requestLevel: MEDIATED_REQUEST_LEVEL.ITEM,
              }),
            }
          ];

          expect(useOkapiKy().post).toHaveBeenCalledWith(...expectedArguments);
        });

        it('should send callout', async () => {
          await waitFor(() => {
            expect(useCallout().sendCallout).toHaveBeenCalled();
          });
        });
      });

      describe('When issue during request confirming', () => {
        const dataToSubmit = {
          ...basicDataToSend,
          fulfillmentPreference: FULFILMENT_TYPES.DELIVERY,
          requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
          createTitleLevelRequest: true,
          deliveryAddressTypeId: 'deliveryAddressTypeId',
          pickupServicePointId: '',
        };

        beforeEach(() => {
          useOkapiKy().post().json.mockRejectedValueOnce({});
          mockSubmitFunctionality(dataToSubmit);
        });

        it('should send error callout', async () => {
          await waitFor(() => {
            expect(useCallout().sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
          });
        });
      });

      describe('When issue during request saving', () => {
        const dataToSubmit = {
          ...basicDataToSend,
          requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
        };

        beforeEach(() => {
          useOkapiKy().post().json.mockRejectedValueOnce({});
          mockSubmitFunctionality(dataToSubmit, true, true);
        });

        it('should send error callout', async () => {
          await waitFor(() => {
            expect(useCallout().sendCallout).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
          });
        });
      });
    });
  });

  describe('urls', () => {
    const idType = 'id';
    const value = 'value';

    it('should return url to get user data', () => {
      const expectedUrl = `users?query=(${idType}=="${value}")`;

      expect(urls[RESOURCE_TYPES.USER](value, idType)).toBe(expectedUrl);
    });

    it('should return url to get item data', () => {
      const expectedUrl = `circulation/items-by-instance?query=(${ITEM_QUERIES[idType]}=="${value}")`;

      expect(urls[RESOURCE_TYPES.ITEM](value, idType)).toBe(expectedUrl);
    });

    it('should return url to get instance data', () => {
      const expectedUrl = `circulation/items-by-instance?query=${value}`;

      expect(urls[RESOURCE_TYPES.INSTANCE](value)).toBe(expectedUrl);
    });

    it('should return url to get loan data', () => {
      const expectedUrl = `circulation/loans?query=(itemId=="${value}") and status.name==Open`;

      expect(urls[RESOURCE_TYPES.LOAN](value)).toBe(expectedUrl);
    });

    it('should return url to get request types when requestId provided', () => {
      const params = {
        requestId: 'requestId',
        operation: 'operation',
      };
      const expectedUrl = `circulation/requests/allowed-service-points?operation=${params.operation}&requestId=${params.requestId}`;

      expect(urls[RESOURCE_TYPES.REQUEST_TYPES](params)).toBe(expectedUrl);
    });

    it('should return url to get request types when itemId provided', () => {
      const params = {
        itemId: 'itemId',
        requesterId: 'requesterId',
        operation: 'operation',
      };
      const expectedUrl = `circulation/requests/allowed-service-points?requesterId=${params.requesterId}&operation=${params.operation}&itemId=${params.itemId}`;

      expect(urls[RESOURCE_TYPES.REQUEST_TYPES](params)).toBe(expectedUrl);
    });

    it('should return url to get request types when instanceId provided', () => {
      const params = {
        instanceId: 'instanceId',
        requesterId: 'requesterId',
        operation: 'operation',
      };
      const expectedUrl = `circulation/requests/allowed-service-points?requesterId=${params.requesterId}&operation=${params.operation}&instanceId=${params.instanceId}`;

      expect(urls[RESOURCE_TYPES.REQUEST_TYPES](params)).toBe(expectedUrl);
    });

    it('should return url to get requests for request preferences', () => {
      const expectedUrl = `request-preference-storage/request-preference?query=(userId=="${value}")`;

      expect(urls[RESOURCE_TYPES.REQUEST_PREFERENCES](value)).toBe(expectedUrl);
    });
  });
});
