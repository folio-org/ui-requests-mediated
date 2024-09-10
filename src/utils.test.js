import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { NoValue } from '@folio/stripes/components';

import {
  transformRequestFilterOptions,
  getIsTitleLevelRequestsFeatureEnabled,
  getRequesterName,
  getTotalCount,
  handleKeyCommand,
  isFormEditing,
  memoizeValidation,
  getTlrSettings,
  getPatronGroup,
  isSubmittingButtonDisabled,
  getFormattedYears,
  getInstanceQueryString,
  getFulfillmentTypeOptions,
  getSelectedAddressTypeId,
  isDeliverySelected,
  resetFieldState,
  getDefaultRequestPreferences,
  getFulfillmentPreference,
  getRequestTypesOptions,
  getDeliveryInformation,
  getResourceTypeId,
  getRequestInformation,
  getNoRequestTypeErrorMessageId,
  validateDropDownValue,
  getUserPreferences,
  getReferredRecordData,
  formatNoteReferrerEntityData,
  getUserHighlightBoxLink,
  getProxyInformation,
  getRequester,
  getFullNameForCsvRecords,
  getDeliveryAddressForCsvRecords,
  modifyRecordsToExport,
} from './utils';
import {
  FULFILMENT_TYPES,
  MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS,
  MEDIATED_REQUEST_TYPES,
  DEFAULT_VIEW_VALUE,
  ID_TYPE_MAP,
  MEDIATED_REQUEST_TYPE_ERROR_TRANSLATIONS,
  MEDIATED_REQUEST_TYPE_ERROR_LEVEL,
} from './constants';

jest.mock('react-router-dom', () => ({
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));
jest.mock('./components/MediatedRequestsActivities/components/AddressDetails', () => jest.fn(() => <div />));

describe('utils', () => {
  describe('transformRequestFilterOptions', () => {
    const formatMessage = jest.fn(({ id }) => id);
    const option = {
      label: 'label',
      value: 'value',
    };

    it('should return data options', () => {
      expect(transformRequestFilterOptions(formatMessage, [option])).toEqual([option]);
    });

    it('should not return data options', () => {
      expect(transformRequestFilterOptions(formatMessage)).toEqual([]);
    });
  });

  describe('getIsTitleLevelRequestsFeatureEnabled', () => {
    it('should return true', () => {
      const data = {
        items: [{
          value: {
            titleLevelRequestsFeatureEnabled: true,
          },
        }],
      };

      expect(getIsTitleLevelRequestsFeatureEnabled(data)).toEqual(true);
    });

    it('should return false', () => {
      const data = {
        items: [{
          value: {
            titleLevelRequestsFeatureEnabled: false,
          },
        }],
      };

      expect(getIsTitleLevelRequestsFeatureEnabled(data)).toEqual(false);
    });

    it('should return default value (false)', () => {
      expect(getIsTitleLevelRequestsFeatureEnabled()).toEqual(false);
    });
  });

  describe('getRequesterName', () => {
    describe('When requester property exists', () => {
      it('should return requester name when last name present', () => {
        expect(getRequesterName({
          requester: {
            lastName: 'Do',
          },
        })).toEqual('Do');
      });

      it('should return requester name when first name and lastName are present', () => {
        expect(getRequesterName({
          requester: {
            firstName: 'Jo',
            lastName: 'Do',
          },
        })).toEqual('Do, Jo');
      });

      it('should return requester name when first name, last name and middle name are present', () => {
        expect(getRequesterName({
          requester: {
            firstName: 'Jo',
            lastName: 'Do',
            middleName: 'Re',
          },
        })).toEqual('Do, Jo Re');
      });

      it('should return requester preferred first name when preferred first name are present', () => {
        expect(getRequesterName({
          requester: {
            firstName: 'Jo',
            lastName: 'Do',
            middleName: 'Re',
            preferredFirstName: 'Pe',
          },
        })).toEqual('Do, Pe Re');
      });
    });

    describe('When requester property does not exist', () => {
      it('should return requester name when last name present', () => {
        expect(getRequesterName({
          personal: {
            lastName: 'Do',
          },
        })).toEqual('Do');
      });
    });

    describe('When requester and personal properties do not exist', () => {
      it('should return requester name when last name present', () => {
        expect(getRequesterName({ lastName: 'Do' })).toEqual('Do');
      });
    });
  });

  describe('getTotalCount', () => {
    it('should return value from total count', () => {
      const source = {
        totalCount: jest.fn(() => (10)),
      };

      expect(getTotalCount(source)).toEqual(10);
    });

    it('should return 0 value', () => {
      expect(getTotalCount()).toEqual(0);
    });
  });

  describe('handlekeycommand', () => {
    const event = {
      preventDefault: jest.fn(),
    };
    const handler = jest.fn();

    afterEach(() => {
      event.preventDefault.mockClear();
      handler.mockClear();
    });

    describe('When disabled is true and event was passed', () => {
      it('should not call handler function', () => {
        handleKeyCommand(handler, { disabled: true })(event);

        expect(handler).not.toHaveBeenCalled();
      });
    });

    describe('When disabled is false and event was passed', () => {
      it('should call handler function', () => {
        handleKeyCommand(handler)(event);

        expect(handler).toHaveBeenCalled();
      });

      it('should call preventDefault', () => {
        handleKeyCommand(handler)(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('When event is not passed', () => {
      it('should not call preventDefault when event is not passed', () => {
        handleKeyCommand(handler)();

        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('isFormEditing', () => {
    describe('When id is presented', () => {
      it('should return true', () => {
        expect(isFormEditing({ id: 'id' })).toBe(true);
      });
    });

    describe('when id is not presented', () => {
      it('should return false', () => {
        expect(isFormEditing({})).toBe(false);
      });
    });
  });

  describe('memoizeValidation', () => {
    const functionResult = 'result';
    const fn = jest.fn(() => functionResult);
    const fieldName = 'item.barcode';
    const key1 = 0;
    const key2 = 1;
    const arg = '123';

    beforeEach(() => {
      fn.mockClear();
    });

    describe('Memoized function', () => {
      describe('When `arg !== lastArg`', () => {
        it('should be invoked with correct argument', () => {
          memoizeValidation(fn)(fieldName, key1)(arg);

          expect(fn).toBeCalledWith(arg);
        });
      });

      describe('When `key !== lastKey && arg === lastArg`', () => {
        it('should be invoked with correct argument', () => {
          memoizeValidation(fn)(fieldName, key2)(arg);

          expect(fn).toBeCalledWith(arg);
        });
      });

      describe('When `key === lastKey && arg === lastArg`', () => {
        let result;

        beforeEach(() => {
          const returnedFunc = memoizeValidation(fn);

          returnedFunc(fieldName, key1)(arg);
          result = returnedFunc(fieldName, key1)(arg);
        });

        it('should be invoked one time only', () => {
          expect(fn).toBeCalledTimes(1);
        });

        it('should return cashed result', () => {
          expect(result).toBe(functionResult);
        });
      });
    });
  });

  describe('getInstanceQueryString', () => {
    const hrid = 'hrid';
    const id = 'instanceId';

    describe('When both values are passed', () => {
      it('should return correct query string', () => {
        const expectedResult = `("hrid"=="${hrid}" or "id"=="${id}")`;

        expect(getInstanceQueryString(hrid, id)).toBe(expectedResult);
      });
    });

    describe('When only `hrid` value is passed', () => {
      it('should return correct query string', () => {
        const expectedResult = `("hrid"=="${hrid}" or "id"=="${hrid}")`;

        expect(getInstanceQueryString(hrid)).toBe(expectedResult);
      });
    });

    describe('When only `id` value is passed', () => {
      it('should return correct query string', () => {
        const expectedResult = `("hrid"=="${id}" or "id"=="${id}")`;

        expect(getInstanceQueryString(id)).toBe(expectedResult);
      });
    });
  });

  describe('getTlrSettings', () => {
    const defaultSettings = {
      titleLevelRequestsFeatureEnabled: true,
      createTitleLevelRequestsByDefault: false,
    };

    it('should return passed settings', () => {
      expect(getTlrSettings(defaultSettings)).toEqual(defaultSettings);
    });

    it('should return empty object', () => {
      expect(getTlrSettings()).toEqual({});
    });
  });

  describe('getPatronGroup', () => {
    describe('When patron has a patron group', () => {
      const patron = {
        patronGroup: 'patronGroupId',
      };
      const patronGroups = [
        {
          id: patron.patronGroup,
        }
      ];

      it('should return correct patron group', () => {
        expect(getPatronGroup(patron, patronGroups)).toEqual(patronGroups[0]);
      });
    });

    describe('When patron does not have a patron group', () => {
      const patron = {};
      const patronGroups = [
        {
          id: 'id',
        }
      ];

      it('should return undefined', () => {
        expect(getPatronGroup(patron, patronGroups)).toBeUndefined();
      });
    });

    describe('When patronGroups argument is empty', () => {
      const patron = {};
      const patronGroups = [];

      it('should return undefined', () => {
        expect(getPatronGroup(patron, patronGroups)).toBeUndefined();
      });
    });
  });

  describe('isSubmittingButtonDisabled', () => {
    describe('when pristine is true and submitting is false', () => {
      it('should return true', () => {
        expect(isSubmittingButtonDisabled(true, false)).toBe(true);
      });
    });

    describe('when pristine is false and submitting is true', () => {
      it('should return true', () => {
        expect(isSubmittingButtonDisabled(false, true)).toBe(true);
      });
    });

    describe('when pristine is true and submitting is true', () => {
      it('should return true', () => {
        expect(isSubmittingButtonDisabled(true, true)).toBe(true);
      });
    });

    describe('when pristine is false and submitting is false', () => {
      it('should return true', () => {
        expect(isSubmittingButtonDisabled(false, false)).toBe(false);
      });
    });
  });

  describe('getFormattedYears', () => {
    describe('When publications are not passed', () => {
      it('should return empty string', () => {
        expect(getFormattedYears()).toBe('');
      });
    });

    describe('When there are no publications', () => {
      it('should return empty string', () => {
        expect(getFormattedYears([])).toBe('');
      });
    });

    describe('When publications are presented', () => {
      it('should format correctly when limit is passed', () => {
        const publications = [
          { dateOfPublication: '1991' },
          { dateOfPublication: 'incorrect_year_2000' },
          { dateOfPublication: '1992' },
          { dateOfPublication: '1990' },
          { dateOfPublication: '2020' }
        ];
        const limit = 3;

        expect(getFormattedYears(publications, limit)).toBe('2020, 1992, 1991');
      });
    });
  });

  describe('resetFieldState', () => {
    const form = {
      getRegisteredFields: jest.fn(),
      resetFieldState: jest.fn(),
    };
    const fieldName = 'test';

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('When field exists', () => {
      beforeEach(() => {
        form.getRegisteredFields.mockReturnValue([fieldName]);
        resetFieldState(form, fieldName);
      });

      it('should trigger get registered fields', () => {
        expect(form.getRegisteredFields).toHaveBeenCalled();
      });

      it('should trigger reset field state', () => {
        expect(form.resetFieldState).toHaveBeenCalledWith(fieldName);
      });
    });

    describe('When field does not exist', () => {
      beforeEach(() => {
        form.getRegisteredFields.mockReturnValue([]);
        resetFieldState(form, fieldName);
      });

      it('should not reset field state', () => {
        expect(form.resetFieldState).not.toHaveBeenCalled();
      });
    });
  });

  describe('getSelectedAddressTypeId', () => {
    it('should return default delivery address type id"', () => {
      const defaultDeliveryAddressTypeId = 'id';

      expect(getSelectedAddressTypeId(true, defaultDeliveryAddressTypeId)).toBe(defaultDeliveryAddressTypeId);
    });

    it('should return empty string', () => {
      expect(getSelectedAddressTypeId(false)).toBe('');
    });
  });

  describe('isDeliverySelected', () => {
    it('should return true', () => {
      expect(isDeliverySelected(FULFILMENT_TYPES.DELIVERY)).toBe(true);
    });

    it('should return false', () => {
      expect(isDeliverySelected('test')).toBe(false);
    });
  });

  describe('getFulfillmentTypeOptions', () => {
    const fulfillmentTypes = [
      {
        label: 'label_1',
        id: 'id',
      },
      {
        label: 'label_2',
        id: FULFILMENT_TYPES.DELIVERY,
      },
    ];

    describe('When hasDelivery is true', () => {
      it('should return not filtered "fulfillmentTypeOptions"', () => {
        const expectedResult = [
          {
            label: fulfillmentTypes[0].label,
            value: fulfillmentTypes[0].id,
          },
          {
            label: fulfillmentTypes[1].label,
            value: fulfillmentTypes[1].id,
          }
        ];

        expect(getFulfillmentTypeOptions(true, fulfillmentTypes)).toEqual(expectedResult);
      });
    });

    describe('When hasDelivery is false', () => {
      it('should return filtered fulfillment type Ootions', () => {
        const expectedResult = [
          {
            label: fulfillmentTypes[0].label,
            value: fulfillmentTypes[0].id,
          }
        ];

        expect(getFulfillmentTypeOptions(false, fulfillmentTypes)).toEqual(expectedResult);
      });
    });
  });

  describe('getDefaultRequestPreferences', () => {
    it('should return correct data', () => {
      const initialValues = {
        fulfillmentPreference:  FULFILMENT_TYPES.DELIVERY,
      };
      const expectedResult = {
        hasDelivery: false,
        defaultDeliveryAddressTypeId: DEFAULT_VIEW_VALUE,
        defaultServicePointId: DEFAULT_VIEW_VALUE,
        deliverySelected: true,
        selectedAddressTypeId: DEFAULT_VIEW_VALUE,
      };

      expect(getDefaultRequestPreferences(initialValues)).toEqual(expectedResult);
    });
  });

  describe('getFulfillmentPreference', () => {
    it('should return correct fulfillment preference', () => {
      const preferences = {};
      const fulfillmentPreference = 'fulfillmentPreference';
      const initialValues = {
        fulfillmentPreference,
      };

      expect(getFulfillmentPreference(preferences, initialValues)).toBe(fulfillmentPreference);
    });
  });

  describe('getRequestTypesOptions', () => {
    it('should return array of options', () => {
      const requestTypes = {
        [MEDIATED_REQUEST_TYPES.HOLD]: [],
      };
      const expectedResult = [
        {
          id: MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS[MEDIATED_REQUEST_TYPES.HOLD],
          value: MEDIATED_REQUEST_TYPES.HOLD,
        }
      ];

      expect(getRequestTypesOptions(requestTypes)).toEqual(expectedResult);
    });
  });

  describe('getDeliveryInformation', () => {
    describe('When user is selected and addressTypes is available', () => {
      const addressId = 'addressId';
      const addressType = 'addressType';
      const selectedUser = {
        personal: {
          addresses: [
            {
              addressTypeId: addressId,
            }
          ],
        },
      };
      const addressTypes = {
        addressTypes: [
          {
            id: addressId,
            addressType,
          }
        ],
      };

      it('should return delivery information', () => {
        const expectedResult = {
          deliveryLocations: [
            {
              label: addressTypes.addressTypes[0].addressType,
              value: selectedUser.personal.addresses[0].addressTypeId,
            }
          ],
          deliveryLocationsDetail: {
            [addressId]: {
              addressTypeId: addressId,
            },
          },
        };

        expect(getDeliveryInformation(selectedUser, addressTypes)).toEqual(expectedResult);
      });
    });

    describe('When user is not selected and addressTypes in not available', () => {
      const selectedUser = {};
      const addressTypes = {};

      it('should return default delivery information', () => {
        const expectedResult = {
          deliveryLocationsDetail: {},
        };

        expect(getDeliveryInformation(selectedUser, addressTypes)).toEqual(expectedResult);
      });
    });
  });

  describe('getResourceTypeId', () => {
    it('should return instance id', () => {
      expect(getResourceTypeId(true)).toBe(ID_TYPE_MAP.INSTANCE_ID);
    });

    it('should return item id', () => {
      expect(getResourceTypeId(false)).toBe(ID_TYPE_MAP.ITEM_ID);
    });
  });

  describe('getRequestInformation', () => {
    const selectedInstance = {
      id: 'instanceId',
    };
    const selectedItem = {
      id: 'itemId',
    };

    it('should return data with selected instance', () => {
      const values = {
        createTitleLevelRequest: true,
      };
      const expectedResult = {
        isTitleLevelRequest: values.createTitleLevelRequest,
        selectedResource: selectedInstance,
      };

      expect(getRequestInformation(values, selectedInstance, selectedItem)).toEqual(expectedResult);
    });

    it('should return data with selected item', () => {
      const values = {
        createTitleLevelRequest: false,
      };
      const expectedResult = {
        isTitleLevelRequest: values.createTitleLevelRequest,
        selectedResource: selectedItem,
      };

      expect(getRequestInformation(values, selectedInstance, selectedItem)).toEqual(expectedResult);
    });
  });

  describe('getNoRequestTypeErrorMessageId', () => {
    it('should return error for title level request', () => {
      expect(getNoRequestTypeErrorMessageId(true)).toBe(MEDIATED_REQUEST_TYPE_ERROR_TRANSLATIONS[MEDIATED_REQUEST_TYPE_ERROR_LEVEL.TITLE_LEVEL_ERROR]);
    });

    it('should return error for item level request', () => {
      expect(getNoRequestTypeErrorMessageId(false)).toBe(MEDIATED_REQUEST_TYPE_ERROR_TRANSLATIONS[MEDIATED_REQUEST_TYPE_ERROR_LEVEL.ITEM_LEVEL_ERROR]);
    });
  });

  describe('validateDropDownValue', () => {
    const value = 'value';

    describe('When shouldValidate is true', () => {
      it('should return undefined', () => {
        expect(validateDropDownValue(true)(value)).toBeUndefined();
      });

      it('should return validation error message', () => {
        const errorMessage = 'ui-requests-mediated.form.errors.requiredToConfirm';

        render(validateDropDownValue(true)(''));

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    describe('When shouldValidate is false', () => {
      it('should return undefined', () => {
        expect(validateDropDownValue(false)(value)).toBeUndefined();
      });
    });
  });

  describe('getUserPreferences', () => {
    const labelIds = {
      deliveryAddress: 'ui-requests-mediated.requesterDetails.deliveryAddress',
      pickupServicePoint: 'ui-requests-mediated.requesterDetails.pickupServicePoint',
    };

    describe('When mediatedRequest is provided', () => {
      const addressTypeId = 'addressTypeId';
      const pickupServicePointId = 'pickupServicePointId';
      const servicePoints = {
        servicepoints: [
          {
            id: pickupServicePointId,
            name: 'pickupServicePointName',
          }
        ],
      };
      const userData = {
        users: [
          {
            personal: {
              addresses: [
                {
                  addressTypeId,
                }
              ],
            },
          }
        ],
      };

      it('should get information with delivery address', () => {
        const mediatedRequest = {
          fulfillmentPreference: FULFILMENT_TYPES.DELIVERY,
          deliveryAddressTypeId: addressTypeId,
        };
        const userPreferences = getUserPreferences(mediatedRequest, userData, servicePoints);

        render(userPreferences.label);

        expect(screen.getByText(labelIds.deliveryAddress)).toBeInTheDocument();
      });

      it('should get information with pickup service point', () => {
        const mediatedRequest = {
          fulfillmentPreference: FULFILMENT_TYPES.HOLD_SHELF,
          pickupServicePointId,
        };
        const userPreferences = getUserPreferences(mediatedRequest, userData, servicePoints);

        render(userPreferences.label);

        expect(screen.getByText(labelIds.pickupServicePoint)).toBeInTheDocument();
      });
    });

    describe('When mediatedRequest is not provided', () => {
      it('should return empty object', () => {
        expect(getUserPreferences()).toEqual({});
      });
    });
  });

  describe('getReferredRecordData', () => {
    describe('When mediatedRequest is provided', () => {
      const mediatedRequest = {
        instance: {
          title: 'title',
        },
        instanceId: 'instanceId',
        item: {
          barcode: 'barcode',
        },
        itemId: 'itemId',
        holdingsRecordId: 'holdingsRecordId',
        requesterId: 'requesterId',
        requester: {
          lastName: 'lastName',
        },
        metadata: {
          createdDate: 'createdDate',
        },
      };

      it('should return referred record data', () => {
        const expectedResult = {
          instanceTitle: mediatedRequest.instance.title,
          instanceId: mediatedRequest.instanceId,
          itemBarcode: mediatedRequest?.item?.barcode,
          itemId: mediatedRequest.itemId,
          holdingsRecordId: mediatedRequest.holdingsRecordId,
          requesterName: mediatedRequest.requester.lastName,
          requesterId: mediatedRequest.requester.id ?? mediatedRequest?.requesterId,
          requestCreateDate: mediatedRequest?.metadata.createdDate,
        };

        expect(getReferredRecordData(mediatedRequest)).toEqual(expectedResult);
      });
    });

    describe('When mediatedRequest is not provided', () => {
      it('should return empty object', () => {
        expect(getReferredRecordData()).toEqual({});
      });
    });
  });

  describe('formatNoteReferrerEntityData', () => {
    describe('When entityData is provided', () => {
      const entityData = {
        entityName: 'entityName',
        entityType: 'entityType',
        entityId: 'entityId',
      };

      it('should return correct entity data', () => {
        const expectedResult = {
          name: entityData.entityName,
          type: entityData.entityType,
          id: entityData.entityId,
        };

        expect(formatNoteReferrerEntityData(entityData)).toEqual(expectedResult);
      });
    });

    describe('When entityData is not provided', () => {
      it('should return false', () => {
        expect(formatNoteReferrerEntityData()).toBe(false);
      });
    });
  });

  describe('getUserHighlightBoxLink', () => {
    it('should render link', () => {
      const linkText = 'link';

      render(getUserHighlightBoxLink(linkText));

      expect(screen.getByText(linkText)).toBeInTheDocument();
    });
  });

  describe('getProxyInformation', () => {
    describe('When proxy is provided', () => {
      it('should return proxy information with barcode', () => {
        const proxy = {
          id: 'id',
          lastName: 'lastName',
          barcode: 'barcode',
        };
        const expectedResult = {
          name: proxy.lastName,
          id: proxy.id,
          barcode: proxy.barcode,
        };

        expect(getProxyInformation(proxy)).toEqual(expectedResult);
      });

      it('should return proxy information without barcode', () => {
        const proxy = {
          id: 'id',
          lastName: 'lastName',
        };
        const expectedResult = {
          name: proxy.lastName,
          id: proxy.id,
          barcode: <NoValue />,
        };

        expect(getProxyInformation(proxy)).toEqual(expectedResult);
      });

      it('should return proxy information with proxyIdFromRequest', () => {
        const proxyIdFromRequest = 'proxyIdFromRequest';
        const proxy = {
          lastName: 'lastName',
          barcode: 'barcode',
        };
        const expectedResult = {
          name: proxy.lastName,
          id: proxyIdFromRequest,
          barcode: proxy.barcode,
        };

        expect(getProxyInformation(proxy, proxyIdFromRequest)).toEqual(expectedResult);
      });
    });

    describe('When proxy is not provided', () => {
      it('should return empty object', () => {
        expect(getProxyInformation()).toEqual({});
      });
    });
  });

  describe('getRequester', () => {
    const selectedUser = {
      id: 'selectedUserId',
    };

    it('should return proxy user', () => {
      const proxy = {
        id: 'proxyId',
      };

      expect(getRequester(proxy, selectedUser)).toEqual(proxy);
    });

    it('should return selected user', () => {
      expect(getRequester(null, selectedUser)).toEqual(selectedUser);
    });
  });

  describe('getFullNameForCsvRecords', () => {
    describe('When all user information exists', () => {
      it('should return user name for CSV report', () => {
        const user = {
          firstName: 'firstName',
          middleName: 'middleName',
          lastName: 'lastName',
        };

        expect(getFullNameForCsvRecords(user)).toBe(`${user.firstName} ${user.middleName} ${user.lastName}`);
      });
    });

    describe('When user information does not exist', () => {
      it('should return empty string', () => {
        expect(getFullNameForCsvRecords({})).toBe('');
      });
    });
  });

  describe('getDeliveryAddressForCsvRecords', () => {
    describe('When all address information exists', () => {
      it('should return delivery address for CSV report', () => {
        const address = {
          addressLine1: 'addressLine1',
          city: 'city',
          region: 'region',
          postalCode: 'postalCode',
          countryId: 'countryId',
        };

        expect(getDeliveryAddressForCsvRecords(address))
          .toBe(`${address.addressLine1} ${address.city} ${address.region} ${address.postalCode} ${address.countryId}`);
      });
    });

    describe('When address information does not exist', () => {
      it('should return empty string', () => {
        expect(getDeliveryAddressForCsvRecords({})).toBe('');
      });
    });
  });

  describe('modifyRecordsToExport', () => {
    it('should return modified records', () => {
      const records = [
        {
          id: 'id_1',
          instance: {
            title: 'title_1',
            contributorNames: [{ name: 'contributor' }],
          },
          proxy: {
            lastName: 'proxyLastName',
            barcode: 'proxyBarcode',
          },
          requester: {
            lastName: 'requesterLastName_1',
            barcode: 'requesterBarcode_1',
          },
          deliveryAddress: {
            addressLine1: 'addressLine1',
          },
        },
        {
          id: 'id_2',
          instance: {
            title: 'title_2',
          },
          requester: {
            lastName: 'requesterLastName_2',
            barcode: 'requesterBarcode_2',
          },
        }
      ];
      const expectedResult = [
        {
          ...records[0],
          instance: {
            ...records[0].instance,
            contributorNames: records[0].instance.contributorNames[0].name,
          },
          proxy: {
            ...records[0].proxy,
            name: records[0].proxy.lastName,
          },
          requester: {
            ...records[0].requester,
            name: records[0].requester.lastName,
          },
          deliveryAddress: records[0].deliveryAddress.addressLine1,
        },
        {
          ...records[1],
          requester: {
            ...records[1].requester,
            name: records[1].requester.lastName,
          },
        }
      ];

      expect(modifyRecordsToExport(records)).toEqual(expectedResult);
    });
  });
});
