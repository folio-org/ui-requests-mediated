import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import RequestForm from './RequestForm';
import RequestInformation from '../RequestInformation';
import {
  FULFILMENT_TYPES,
  ID_TYPE_MAP,
  MEDIATED_REQUEST_OPERATIONS,
  MEDIATED_REQUEST_TYPES,
  MEDIATED_REQUEST_FORM_FIELD_NAMES,
  RESOURCE_KEYS,
  RESOURCE_TYPES,
  DEFAULT_REQUEST_TYPE_VALUE,
  MEDIATED_REQUEST_LEVEL,
  EMPTY_MEDIATED_REQUEST_FORM_VALUE,
} from '../../../../constants';
import {
  getRequestInformation,
  getFulfillmentPreference,
  getDefaultRequestPreferences,
  isProxyFunctionalityAvailable,
} from '../../../../utils';

const basicProps = {
  handleSubmit: jest.fn(),
  findResource: jest.fn(),
  submitInitiator: {
    current: '',
  },
  onCancel: jest.fn(),
  onSetSelectedItem: jest.fn(),
  onSetSelectedUser: jest.fn(),
  onSetSelectedProxy: jest.fn(),
  onSetSelectedInstance: jest.fn(),
  request: null,
  initialValues: {},
  location: {
    search: '',
  },
  values: {
    createTitleLevelRequest: false,
  },
  form: {
    change: jest.fn(),
  },
  submitting: false,
  patronGroups: [],
  selectedItem: {},
  selectedInstance: {},
  selectedUser: {},
  isEditMode: false,
  setRequest: jest.fn(),
};
const labelIds = {
  itemAccordion: 'ui-requests-mediated.form.item.accordionLabel',
};
const testIds = {
  findItem: 'findItem',
  findInstance: 'findInstance',
  findUser: 'findUser',
  selectProxy: 'selectProxy',
  tlrCheckbox: 'tlrCheckbox',
};
const itemBarcode = 'itemBarcode';
const instanceId = 'instanceId';
const userBarcode = 'userBarcode';
const proxyId = 'proxyId';

jest.mock('@folio/stripes/final-form', () => () => jest.fn((component) => component));
jest.mock('../RequestFormShortcutsWrapper', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('../RequestFormFirstMenu', () => jest.fn(() => <div />));
jest.mock('../RequestFormFooter', () => jest.fn(() => <div />));
jest.mock('../ItemInformation', () => jest.fn(({
  findItem,
}) => {
  const onFindItem = () => {
    findItem('barcode', itemBarcode);
  };

  return (
    <>
      <button
        type="button"
        data-testid={testIds.findItem}
        onClick={onFindItem}
      >
        Find Item
      </button>
    </>
  );
}));
jest.mock('../InstanceInformation', () => jest.fn(({
  findInstance,
}) => {
  const onFindInstance = () => {
    findInstance(instanceId);
  };

  return (
    <>
      <button
        type="button"
        data-testid={testIds.findInstance}
        onClick={onFindInstance}
      >
        Find Instance
      </button>
    </>
  );
}));
jest.mock('../RequesterInformation', () => jest.fn(({
  findUser,
  selectRequester,
}) => {
  const onFindUser = () => {
    findUser('barcode', userBarcode);
  };
  const onSelectProxy = () => {
    selectRequester({ id: proxyId });
  };

  return (
    <>
      <button
        type="button"
        data-testid={testIds.findUser}
        onClick={onFindUser}
      >
        Find User
      </button>
      <button
        type="button"
        data-testid={testIds.selectProxy}
        onClick={onSelectProxy}
      >
        Select proxy
      </button>
    </>
  );
}));
jest.mock('../RequestInformation', () => jest.fn(() => <div />));
jest.mock('../FulfilmentPreference', () => jest.fn(() => <div />));
jest.mock('../AddressDetails', () => jest.fn(() => <div />));
jest.mock('../ItemsDialog', () => jest.fn(() => <div />));
jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  getTlrSettings: jest.fn(() => ({
    titleLevelRequestsFeatureEnabled: true,
  })),
  handleKeyCommand: jest.fn(),
  getPatronGroup: jest.fn(),
  resetFieldState: jest.fn(),
  getFulfillmentTypeOptions: jest.fn(() => []),
  getDefaultRequestPreferences: jest.fn(),
  getFulfillmentPreference: jest.fn(),
  getSelectedAddressTypeId: jest.fn(),
  isDelivery: jest.fn(),
  getRequestTypesOptions: jest.fn(() => []),
  getDeliveryInformation: jest.fn(() => ({
    deliveryLocationsDetail: {},
  })),
  getResourceTypeId: jest.fn(() => 'itemId'),
  getRequestInformation: jest.fn((isTlr, instance, item) => {
    return isTlr ? instance : item;
  }),
  isProxyFunctionalityAvailable: jest.fn(),
}));

describe('RequestForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
    basicProps.form.change.mockClear();
  });

  describe('Initial render', () => {
    describe('When creating mode', () => {
      beforeEach(() => {
        render(
          <RequestForm
            {...basicProps}
          />
        );
      });

      it('should render item accordion label', () => {
        const accordionLabel = screen.getByText(labelIds.itemAccordion);

        expect(accordionLabel).toBeInTheDocument();
      });

      it('should not find user information', () => {
        const args = [RESOURCE_TYPES.USER, expect.any(String), expect.any(String)];

        expect(basicProps.findResource).not.toHaveBeenCalledWith(...args);
      });
    });

    describe('When editing mode', () => {
      const foundItem = {
        items: [
          {
            id: 'itemId',
            barcode: 'itemBarcode',
          }
        ],
      };
      const foundInstance = {
        id: 'instanceId',
        hrid: 'instanceHrid',
      };
      const foundUser = {
        totalRecords: 1,
        users: [
          {
            id: 'userId',
          }
        ],
      };
      const foundLoan = {
        loans: [],
      };
      const foundRequestPreferences = {};

      describe('When title level request with removed requester', () => {
        const props = {
          ...basicProps,
          isEditMode: true,
          request: {
            requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
            patronComments: 'comment',
            instanceId: 'instanceId',
            instance: {
              hrid: 'instanceHrid',
            },
            requesterId: 'requesterId',
            requester: {
              barcode: 'requesterBarcode',
            },
            proxy: {
              lastName: 'proxyLastName',
            },
            proxyUserId: 'proxyUserId',
          },
        };
        const user = {
          totalRecords: 0,
          users: [],
        };

        beforeEach(() => {
          isProxyFunctionalityAvailable.mockReturnValue(true);
          props.findResource
            .mockResolvedValueOnce(foundInstance)
            .mockResolvedValueOnce(user);

          render(
            <RequestForm
              {...props}
            />
          );
        });

        it('should set instance hrid', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, props.request.instance.hrid];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should set requester barcode', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_BARCODE, props.request.requester.barcode];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should set patron comments', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.PATRON_COMMENTS, props.request.patronComments];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should set instance id', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, foundInstance.id];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should find instance information', () => {
          const args = [RESOURCE_TYPES.INSTANCE, props.request.instanceId];

          expect(basicProps.findResource).toHaveBeenCalledWith(...args);
        });

        it('should set proxy user id', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, props.request.proxyUserId];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should set proxy data', () => {
          expect(basicProps.onSetSelectedProxy).toHaveBeenCalledWith(props.request.proxy);
        });
      });

      describe('When title level request with existing user and without request types', () => {
        const props = {
          ...basicProps,
          isEditMode: true,
          request: {
            requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
            patronComments: 'comment',
            instanceId: 'instanceId',
            requesterId: 'requesterId',
            instance: {
              hrid: 'instanceHrid',
            },
            requester: {
              barcode: 'requesterBarcode',
            },
          },
        };
        const foundRequestTypes = {};
        const requestPreferences = {
          fulfillmentPreference: FULFILMENT_TYPES.HOLD_SHELF,
          defaultDeliveryAddressTypeId: 'defaultDeliveryAddressTypeId',
          defaultServicePointId: 'defaultServicePointId',
        };

        beforeEach(() => {
          getDefaultRequestPreferences.mockReturnValueOnce(requestPreferences);
          props.findResource
            .mockResolvedValueOnce(foundInstance)
            .mockResolvedValueOnce(foundUser)
            .mockResolvedValueOnce(foundRequestPreferences)
            .mockResolvedValueOnce(foundRequestTypes);

          render(
            <RequestForm
              {...props}
            />
          );
        });

        it('should find user information', () => {
          const args = [RESOURCE_TYPES.USER, props.request.requesterId, RESOURCE_KEYS.ID];

          expect(basicProps.findResource).toHaveBeenCalledWith(...args);
        });

        it('should find request types information', () => {
          const args = [
            RESOURCE_TYPES.REQUEST_TYPES,
            {
              operation: MEDIATED_REQUEST_OPERATIONS.CREATE,
              [ID_TYPE_MAP.INSTANCE_ID]: foundInstance.id,
              requesterId: foundUser.users[0].id,
            }
          ];

          expect(basicProps.findResource).toHaveBeenCalledWith(...args);
        });

        it('should set fulfilment preference', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, requestPreferences.fulfillmentPreference];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should set service point id', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, requestPreferences.defaultServicePointId];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should set delivery address type id', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, requestPreferences.defaultDeliveryAddressTypeId];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });
      });

      describe('When item level request with existing user, request type and service point', () => {
        const props = {
          ...basicProps,
          isEditMode: true,
          request: {
            requestLevel: MEDIATED_REQUEST_LEVEL.ITEM,
            patronComments: 'comment',
            instanceId: 'instanceId',
            itemId: 'itemId',
            requesterId: 'requesterId',
            requestType: MEDIATED_REQUEST_TYPES.PAGE,
            fulfillmentPreference: FULFILMENT_TYPES.HOLD_SHELF,
            pickupServicePointId: 'pickupServicePointId',
            item: {
              barcode: 'itemBarcode',
            },
            requester: {
              barcode: 'requesterBarcode',
            },
          },
        };
        const foundRequestTypes = {
          [MEDIATED_REQUEST_TYPES.PAGE]: [
            {
              id: props.request.pickupServicePointId,
            }
          ],
        };

        beforeEach(() => {
          getDefaultRequestPreferences.mockReturnValueOnce({
            defaultDeliveryAddressTypeId: 'defaultDeliveryAddressTypeId',
            defaultServicePointId: 'defaultServicePointId',
          });
          props.findResource
            .mockResolvedValueOnce(foundItem)
            .mockResolvedValueOnce(foundUser)
            .mockResolvedValueOnce(foundLoan)
            .mockResolvedValueOnce(foundRequestPreferences)
            .mockResolvedValueOnce(foundRequestTypes);

          render(
            <RequestForm
              {...props}
            />
          );
        });

        it('should set item barcode', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, props.request.item.barcode];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should find item information', () => {
          const args = [RESOURCE_TYPES.ITEM, props.request.itemId, RESOURCE_KEYS.ID];

          expect(basicProps.findResource).toHaveBeenCalledWith(...args);
        });

        it('should find request types information', () => {
          const args = [
            RESOURCE_TYPES.REQUEST_TYPES,
            {
              operation: MEDIATED_REQUEST_OPERATIONS.CREATE,
              [ID_TYPE_MAP.ITEM_ID]: foundItem.items[0].id,
              requesterId: foundUser.users[0].id,
            }
          ];

          expect(basicProps.findResource).toHaveBeenCalledWith(...args);
        });

        it('should set request type', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, props.request.requestType];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should set fulfillment preference', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, props.request.fulfillmentPreference];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });

        it('should set service point id', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, props.request.pickupServicePointId];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });
      });

      describe('When item level request with existing user, request type and delivery address', () => {
        const deliveryAddressTypeId = 'deliveryAddressTypeId';
        const props = {
          ...basicProps,
          selectedUser: {
            personal: {
              addresses: [
                {
                  addressTypeId: deliveryAddressTypeId,
                }
              ],
            },
          },
          isEditMode: true,
          request: {
            requestLevel: MEDIATED_REQUEST_LEVEL.ITEM,
            patronComments: 'comment',
            instanceId: 'instanceId',
            itemId: 'itemId',
            item: {
              barcode: 'itemBarcode',
            },
            requester: {
              barcode: 'requesterBarcode',
            },
            requesterId: 'requesterId',
            requestType: MEDIATED_REQUEST_TYPES.PAGE,
            fulfillmentPreference: FULFILMENT_TYPES.DELIVERY,
            deliveryAddressTypeId,
          },
        };
        const foundRequestTypes = {
          [MEDIATED_REQUEST_TYPES.PAGE]: [
            {
              id: props.request.pickupServicePointId,
            }
          ],
        };

        beforeEach(() => {
          getDefaultRequestPreferences.mockReturnValueOnce({ hasDelivery: true });
          props.findResource
            .mockResolvedValueOnce(foundItem)
            .mockResolvedValueOnce(foundUser)
            .mockResolvedValueOnce(foundLoan)
            .mockResolvedValueOnce(foundRequestPreferences)
            .mockResolvedValueOnce(foundRequestTypes);

          render(
            <RequestForm
              {...props}
            />
          );
        });

        it('should set delivery address', () => {
          const args = [MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, props.request.deliveryAddressTypeId];

          expect(basicProps.form.change).toHaveBeenCalledWith(...args);
        });
      });

      describe('When error for item level request', () => {
        const props = {
          ...basicProps,
          isEditMode: true,
          request: {
            requestLevel: MEDIATED_REQUEST_LEVEL.ITEM,
            patronComments: 'comment',
            instanceId: 'instanceId',
            itemId: 'itemId',
            requesterId: 'requesterId',
            item: {
              barcode: 'itemBarcode',
            },
            requester: {
              barcode: 'requesterBarcode',
            },
          },
        };

        beforeEach(() => {
          props.findResource
            .mockResolvedValueOnce(foundItem)
            .mockResolvedValueOnce(foundUser)
            .mockResolvedValueOnce(foundLoan)
            .mockResolvedValueOnce({
              'brokenData': 'data',
            });

          render(
            <RequestForm
              {...props}
            />
          );
        });

        it('should reset item information', () => {
          expect(props.onSetSelectedItem).toHaveBeenCalledWith(null);
        });

        it('should reset user information', () => {
          expect(props.onSetSelectedUser).toHaveBeenCalledWith(null);
        });
      });

      describe('When error for title level request', () => {
        const props = {
          ...basicProps,
          isEditMode: true,
          request: {
            requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
            patronComments: 'comment',
            instanceId: 'instanceId',
            requesterId: 'requesterId',
            instance: {
              hrid: 'instanceHrid',
            },
            requester: {
              barcode: 'requesterBarcode',
            },
          },
        };

        beforeEach(() => {
          props.findResource
            .mockResolvedValueOnce(foundInstance)
            .mockResolvedValueOnce(foundUser)
            .mockResolvedValueOnce({
              'brokenData': 'data',
            });

          render(
            <RequestForm
              {...props}
            />
          );
        });

        it('should reset instance information', () => {
          expect(props.onSetSelectedInstance).toHaveBeenCalledWith(null);
        });
      });

      describe('When request information received during page reloading', () => {
        const props = {
          ...basicProps,
          match: {
            params: {
              id: 'requestId',
            },
          },
          isEditMode: true,
        };
        const foundRequestTypes = {};
        const foundRequest = {
          id: props.match.params.id,
          requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
          patronComments: 'comment',
          instanceId: 'instanceId',
          requesterId: 'requesterId',
          instance: {
            hrid: 'instanceHrid',
          },
          requester: {
            barcode: 'requesterBarcode',
          },
        };

        beforeEach(() => {
          props.findResource
            .mockResolvedValueOnce(foundRequest)
            .mockResolvedValueOnce(foundInstance)
            .mockResolvedValueOnce(foundUser)
            .mockResolvedValueOnce(foundRequestPreferences)
            .mockResolvedValueOnce(foundRequestTypes);

          render(
            <RequestForm
              {...props}
            />
          );
        });

        it('should set found request', () => {
          expect(props.setRequest).toHaveBeenCalledWith(foundRequest);
        });

        it('should find request information', () => {
          const args = [RESOURCE_TYPES.REQUEST_BY_ID, props.match.params.id];

          expect(basicProps.findResource).toHaveBeenCalledWith(...args);
        });
      });
    });
  });

  describe('TLR checkbox', () => {
    const props = {
      ...basicProps,
      values: {
        createTitleLevelRequest: true,
      },
    };

    beforeEach(() => {
      render(
        <RequestForm
          {...props}
        />
      );

      const tlrCheckbox = screen.getByTestId(testIds.tlrCheckbox);

      fireEvent.click(tlrCheckbox);
    });

    it('should change tlr value to false', () => {
      const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.CREATE_TLR, false];

      expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
    });

    it('should reset item barcode value', () => {
      const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, EMPTY_MEDIATED_REQUEST_FORM_VALUE];

      expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
    });

    it('should reset instance hrid value', () => {
      const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, EMPTY_MEDIATED_REQUEST_FORM_VALUE];

      expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
    });

    it('should reset instance id value', () => {
      const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, EMPTY_MEDIATED_REQUEST_FORM_VALUE];

      expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
    });

    it('should set default request type value', () => {
      const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE];

      expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
    });
  });

  describe('ItemInformation', () => {
    describe('When item data exists', () => {
      const foundItem = {
        items: [
          {
            id: 'itemId',
            barcode: 'itemBarcode',
          }
        ],
      };
      const foundLoan = {
        loans: [],
      };

      beforeEach(() => {
        render(
          <RequestForm
            {...basicProps}
          />
        );

        const findItemButton = screen.getByTestId(testIds.findItem);

        basicProps.findResource
          .mockResolvedValueOnce(foundItem)
          .mockResolvedValueOnce(foundLoan);
        fireEvent.click(findItemButton);
      });

      it('should find item', () => {
        const expectedArgs = [RESOURCE_TYPES.ITEM, itemBarcode, RESOURCE_KEYS.BARCODE];

        expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set item id form value', () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_ID, foundItem.items[0].id];

        expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set item barcode form value', () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, foundItem.items[0].barcode];

        expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set selected item', () => {
        expect(basicProps.onSetSelectedItem).toHaveBeenCalledWith(foundItem.items[0]);
      });

      it('should find related loans', () => {
        const expectedArgs = [RESOURCE_TYPES.LOAN, foundItem.items[0].id];

        expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
      });
    });

    describe('When item data does not exist', () => {
      const foundItem = {
        items: [],
      };

      beforeEach(() => {
        render(
          <RequestForm
            {...basicProps}
          />
        );

        const findItemButton = screen.getByTestId(testIds.findItem);

        basicProps.findResource.mockResolvedValueOnce(foundItem);
        fireEvent.click(findItemButton);
      });

      it('should not set item id form value', async () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_ID, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });

      it('should not set item barcode form value', async () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });
    });

    describe('When item data request throws error', () => {
      beforeEach(() => {
        render(
          <RequestForm
            {...basicProps}
          />
        );

        const findItemButton = screen.getByTestId(testIds.findItem);

        basicProps.findResource.mockRejectedValueOnce({});
        fireEvent.click(findItemButton);
      });

      it('should set selected item to null', async () => {
        await waitFor(() => {
          expect(basicProps.onSetSelectedItem).toHaveBeenCalledWith(null);
        });
      });
    });
  });

  describe('RequesterInformation', () => {
    describe('When user data exists', () => {
      const foundUser = {
        totalRecords: 1,
        users: [
          {
            id: 'userId',
            barcode: 'userBarcode',
          }
        ],
      };
      const foundRequestPreferences = {
        requestPreferences: [
          {
            defaultDeliveryAddressTypeId: '',
            defaultServicePointId: 'defaultServicePointId',
            delivery: false,
          }
        ],
      };
      const foundRequestTypes = {
        [MEDIATED_REQUEST_TYPES.PAGE]: [
          {
            id: 'id',
            name: 'servicePoint',
          }
        ],
      };
      const props = {
        ...basicProps,
        selectedItem: {
          id: 'itemId',
        },
      };

      describe('When Hold Shelf is selected', () => {
        beforeEach(() => {
          render(
            <RequestForm
              {...props}
            />
          );
          getRequestInformation.mockReturnValueOnce(props.selectedItem);
          getFulfillmentPreference.mockReturnValueOnce(FULFILMENT_TYPES.HOLD_SHELF);

          const findUserButton = screen.getByTestId(testIds.findUser);

          basicProps.findResource
            .mockResolvedValueOnce(foundUser)
            .mockResolvedValueOnce(foundRequestPreferences)
            .mockResolvedValueOnce(foundRequestTypes);
          fireEvent.click(findUserButton);
        });

        it('should find user', () => {
          const expectedArgs = [RESOURCE_TYPES.USER, userBarcode, RESOURCE_KEYS.BARCODE];

          expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
        });

        it('should set requester id form value', () => {
          const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, foundUser.users[0].id];

          expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
        });

        it('should set requester form value', () => {
          const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER, foundUser.users[0]];

          expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
        });

        it('should set selected user', () => {
          expect(basicProps.onSetSelectedUser).toHaveBeenCalledWith(foundUser.users[0]);
        });

        it('should find request preferences', () => {
          const expectedArgs = [RESOURCE_TYPES.REQUEST_PREFERENCES, foundUser.users[0].id];

          expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
        });

        it('should find request types', () => {
          const expectedArgs = [
            RESOURCE_TYPES.REQUEST_TYPES,
            {
              operation: MEDIATED_REQUEST_OPERATIONS.CREATE,
              requesterId: foundUser.users[0].id,
              [ID_TYPE_MAP.ITEM_ID]: props.selectedItem.id,
            }
          ];

          expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
        });

        it('should set fulfilment preferences', async () => {
          const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, FULFILMENT_TYPES.HOLD_SHELF];

          await waitFor(() => {
            expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
          });
        });

        it('should reset delivery address type id', async () => {
          const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, ''];

          await waitFor(() => {
            expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
          });
        });
      });

      describe('When error while receiving request preferences', () => {
        const fulfillmentPreference = 'testFulfillmentPreference';

        beforeEach(() => {
          getDefaultRequestPreferences.mockReturnValueOnce({ fulfillmentPreference });
          render(
            <RequestForm
              {...props}
            />
          );

          const findUserButton = screen.getByTestId(testIds.findUser);

          basicProps.findResource
            .mockResolvedValueOnce(foundUser)
            .mockRejectedValueOnce({})
            .mockResolvedValueOnce(foundRequestTypes);
          fireEvent.click(findUserButton);
        });

        it('should set default fulfilment preference', () => {
          const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, fulfillmentPreference];

          expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
        });
      });
    });

    describe('When user data does not exist', () => {
      const foundUser = {
        users: [],
        totalRecords: 0,
      };

      beforeEach(() => {
        render(
          <RequestForm
            {...basicProps}
          />
        );

        const findUserButton = screen.getByTestId(testIds.findUser);

        basicProps.findResource.mockResolvedValueOnce(foundUser);
        fireEvent.click(findUserButton);
      });

      it('should not set requester id form value', async () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });

      it('should not set requester form value', async () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });

      it('should not find request preferences', async () => {
        const expectedArgs = [RESOURCE_TYPES.REQUEST_PREFERENCES, expect.any(String), 'userId'];

        await waitFor(() => {
          expect(basicProps.findResource).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });
    });

    describe('When user data request throws error', () => {
      beforeEach(() => {
        render(
          <RequestForm
            {...basicProps}
          />
        );

        const findUserButton = screen.getByTestId(testIds.findUser);

        basicProps.findResource.mockRejectedValueOnce({});
        fireEvent.click(findUserButton);
      });

      it('should set selected user to null', async () => {
        await waitFor(() => {
          expect(basicProps.onSetSelectedUser).toHaveBeenCalledWith(null);
        });
      });
    });

    describe('When user has a proxy', () => {
      describe('When user is acting as himself', () => {
        const props = {
          ...basicProps,
          selectedUser: {
            id: proxyId,
          },
        };

        beforeEach(() => {
          render(
            <RequestForm
              {...props}
            />
          );

          const selectProxyButton = screen.getByTestId(testIds.selectProxy);

          fireEvent.click(selectProxyButton);
        });

        it('should not set requester id', () => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, proxyId);
        });

        it('should not set proxy user id', () => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(MEDIATED_REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, props.selectedUser.id);
        });
      });

      describe('When user is acting as a proxy', () => {
        const props = {
          ...basicProps,
          selectedUser: {
            id: 'selectedUserId',
          },
          selectedItem: {
            id: 'itemId',
          },
        };
        const foundRequestPreferences = {
          requestPreferences: [
            {
              defaultDeliveryAddressTypeId: '',
              defaultServicePointId: 'defaultServicePointId',
              delivery: false,
            }
          ],
        };
        const foundRequestTypes = {
          [MEDIATED_REQUEST_TYPES.PAGE]: [
            {
              id: 'id',
              name: 'servicePoint',
            }
          ],
        };

        beforeEach(() => {
          basicProps.findResource
            .mockResolvedValueOnce(foundRequestPreferences)
            .mockResolvedValueOnce(foundRequestTypes);

          render(
            <RequestForm
              {...props}
            />
          );

          const selectProxyButton = screen.getByTestId(testIds.selectProxy);

          fireEvent.click(selectProxyButton);
        });

        it('should set requester id', () => {
          expect(basicProps.form.change).toHaveBeenCalledWith(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, proxyId);
        });

        it('should set proxy user id', () => {
          expect(basicProps.form.change).toHaveBeenCalledWith(MEDIATED_REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, props.selectedUser.id);
        });

        it('should find request preferences', () => {
          const expectedArgs = [RESOURCE_TYPES.REQUEST_PREFERENCES, proxyId];

          expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
        });

        it('should find request types', () => {
          const expectedArgs = [
            RESOURCE_TYPES.REQUEST_TYPES,
            {
              operation: MEDIATED_REQUEST_OPERATIONS.CREATE,
              requesterId: proxyId,
              [ID_TYPE_MAP.ITEM_ID]: props.selectedItem.id,
            }
          ];

          expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
        });
      });
    });
  });

  describe('InstanceInformation', () => {
    const props = {
      ...basicProps,
      values: {
        createTitleLevelRequest: true,
      },
    };

    describe('When instance data exists', () => {
      const foundInstance = {
        id: instanceId,
        hrid: 'hrid',
      };

      beforeEach(() => {
        render(
          <RequestForm
            {...props}
          />
        );

        const findInstanceButton = screen.getByTestId(testIds.findInstance);

        basicProps.findResource.mockResolvedValueOnce(foundInstance);
        fireEvent.click(findInstanceButton);
      });

      it('should find instance', () => {
        const expectedArgs = [RESOURCE_TYPES.INSTANCE, instanceId];

        expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set instance id form value', () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, foundInstance.id];

        expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set instance hrid form value', () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, foundInstance.hrid];

        expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set selected instance', () => {
        expect(basicProps.onSetSelectedInstance).toHaveBeenCalledWith(foundInstance);
      });
    });

    describe('When instance data does not exist', () => {
      const foundInstance = {};

      beforeEach(() => {
        render(
          <RequestForm
            {...props}
          />
        );

        const findInstanceButton = screen.getByTestId(testIds.findInstance);

        basicProps.findResource.mockResolvedValueOnce(foundInstance);
        fireEvent.click(findInstanceButton);
      });

      it('should not set instance id form value', async () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });

      it('should not set instance hrid form value', async () => {
        const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });
    });

    describe('When instance data request throws error', () => {
      beforeEach(() => {
        render(
          <RequestForm
            {...props}
          />
        );

        const findInstanceButton = screen.getByTestId(testIds.findInstance);

        basicProps.findResource.mockRejectedValueOnce({});
        fireEvent.click(findInstanceButton);
      });

      it('should set selected instance to null', async () => {
        await waitFor(() => {
          expect(basicProps.onSetSelectedInstance).toHaveBeenCalledWith(null);
        });
      });
    });
  });

  describe('RequestInformation', () => {
    beforeEach(() => {
      render(
        <RequestForm
          {...basicProps}
        />
      );
    });

    it('should trigger with correct props', () => {
      const expectedProps = {
        request: null,
        requestTypeOptions: [],
        isTitleLevelRequest: basicProps.values.createTitleLevelRequest,
        isRequestTypesReceived: false,
        isRequestTypeLoading: false,
        isSelectedInstance: false,
        isSelectedItem: false,
        isSelectedUser: false,
        values: basicProps.values,
        isEditMode: false,
      };

      expect(RequestInformation).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });
});
