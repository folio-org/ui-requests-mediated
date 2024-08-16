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
} from '../../../../constants';
import {
  getRequestInformation,
  getFulfillmentPreference,
  isDeliverySelected,
} from '../../../../utils';

const basicProps = {
  handleSubmit: jest.fn(),
  findResource: jest.fn(),
  onSetSubmitInitiator: jest.fn(),
  onCancel: jest.fn(),
  onSetSelectedItem: jest.fn(),
  onSetSelectedUser: jest.fn(),
  onSetSelectedInstance: jest.fn(),
  request: {},
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
  pristine: true,
  submitting: false,
  patronGroups: [],
  selectedItem: {},
  selectedInstance: {},
  selectedUser: {},
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
  selectProxy,
}) => {
  const onFindUser = () => {
    findUser('barcode', userBarcode);
  };
  const onSelectProxy = () => {
    selectProxy({ id: proxyId });
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
  isSubmittingButtonDisabled: jest.fn(),
  isFormEditing: jest.fn(),
  resetFieldState: jest.fn(),
  getFulfillmentTypeOptions: jest.fn(() => []),
  getDefaultRequestPreferences: jest.fn(),
  getFulfillmentPreference: jest.fn(),
  getSelectedAddressTypeId: jest.fn(),
  isDeliverySelected: jest.fn(),
  getRequestTypesOptions: jest.fn(() => []),
  getDeliveryInformation: jest.fn(() => ({
    deliveryLocationsDetail: {},
  })),
  getResourceTypeId: jest.fn(() => 'itemId'),
  getRequestInformation: jest.fn(() => ({
    selectedResource: {
      id: 'id',
    },
    isTitleLevelRequest: false,
  })),
  getRequester: jest.fn((proxy, selectedUser) => selectedUser),
}));

describe('RequestForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial render', () => {
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
      const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, null];

      expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
    });

    it('should reset instance hrid value', () => {
      const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, null];

      expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
    });

    it('should reset instance id value', () => {
      const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, null];

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

      describe('When delivery is not selected', () => {
        beforeEach(() => {
          render(
            <RequestForm
              {...props}
            />
          );
          getRequestInformation.mockReturnValueOnce({
            isTitleLevelRequest: false,
            selectedResource: props.selectedItem,
          });
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
          const expectedArgs = [RESOURCE_TYPES.REQUEST_PREFERENCES, foundUser.users[0].id, 'userId'];

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

      describe('When delivery is selected', () => {
        beforeEach(() => {
          render(
            <RequestForm
              {...props}
            />
          );
          getRequestInformation.mockReturnValueOnce({
            isTitleLevelRequest: false,
            selectedResource: props.selectedItem,
          });
          getFulfillmentPreference.mockReturnValueOnce(FULFILMENT_TYPES.HOLD_SHELF);
          isDeliverySelected.mockReturnValueOnce(true);

          const findUserButton = screen.getByTestId(testIds.findUser);

          basicProps.findResource
            .mockResolvedValueOnce(foundUser)
            .mockResolvedValueOnce(foundRequestPreferences)
            .mockResolvedValueOnce(foundRequestTypes);
          fireEvent.click(findUserButton);
        });

        it('should reset pickup service point id', async () => {
          const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, ''];

          await waitFor(() => {
            expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
          });
        });
      });

      describe('When error while receiving request preferences', () => {
        beforeEach(() => {
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

        it('should set fulfilment preference to hold shelf', async () => {
          const expectedArgs = [MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, FULFILMENT_TYPES.HOLD_SHELF];

          await waitFor(() => {
            expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
          });
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
          const expectedArgs = [RESOURCE_TYPES.REQUEST_PREFERENCES, proxyId, 'userId'];

          expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
        });

        it('should find request types', () => {
          const selectedResourceId = 'id';
          const expectedArgs = [
            RESOURCE_TYPES.REQUEST_TYPES,
            {
              operation: MEDIATED_REQUEST_OPERATIONS.CREATE,
              requesterId: proxyId,
              [ID_TYPE_MAP.ITEM_ID]: selectedResourceId,
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
        updateRequestPreferencesFields: expect.any(Function),
        request: {},
        requestTypeOptions: [],
        isTitleLevelRequest: basicProps.values.createTitleLevelRequest,
        isRequestTypesReceived: false,
        isRequestTypeLoading: false,
        isSelectedInstance: false,
        isSelectedItem: false,
        isSelectedUser: false,
        values: basicProps.values,
        form: basicProps.form,
        shouldValidate: false,
      };

      expect(RequestInformation).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });
});
