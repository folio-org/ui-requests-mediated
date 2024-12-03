import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import {
  isEmpty,
  set,
} from 'lodash';

import {
  Accordion,
  AccordionSet,
  Col,
  Pane,
  Paneset,
  Row,
  Checkbox,
  AccordionStatus,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import RequestFormShortcutsWrapper from '../RequestFormShortcutsWrapper';
import ItemInformation from '../ItemInformation';
import InstanceInformation from '../InstanceInformation';
import RequesterInformation from '../RequesterInformation';
import ItemsDialog from '../ItemsDialog';
import RequestFormFirstMenu from '../RequestFormFirstMenu';
import RequestFormFooter from '../RequestFormFooter';
import RequestInformation from '../RequestInformation';
import FulfilmentPreference from '../FulfilmentPreference';
import AddressDetails from '../AddressDetails';
import {
  MEDIATED_REQUEST_LEVEL,
  RESOURCE_TYPES,
  RESOURCE_KEYS,
  MEDIATED_REQUEST_FORM_FIELD_NAMES,
  MEDIATED_REQUEST_OPERATIONS,
  DEFAULT_REQUEST_TYPE_VALUE,
  FULFILMENT_TYPES_MAP,
  FULFILMENT_TYPES,
  SAVE_BUTTON_ID,
  ID_TYPE_MAP,
  CONFIRM_BUTTON_ID,
  EMPTY_MEDIATED_REQUEST_FORM_VALUE,
  EMPTY_RESOURCE_VALUE,
} from '../../../../constants';
import {
  handleKeyCommand,
  getPatronGroup,
  getTlrSettings,
  resetFieldState,
  getFulfillmentTypeOptions,
  getDefaultRequestPreferences,
  getFulfillmentPreference,
  isDelivery,
  getRequestTypesOptions,
  getDeliveryInformation,
  getResourceTypeId,
  getRequestInformation,
  isProxyFunctionalityAvailable,
} from '../../../../utils';

import css from './RequestForm.css';

class RequestForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    findResource: PropTypes.func.isRequired,
    submitInitiator: PropTypes.object.isRequired,
    addressTypes: PropTypes.arrayOf({
      addressType: PropTypes.string,
      id: PropTypes.string,
    }).isRequired,
    request: PropTypes.object.isRequired,
    settings: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object),
    }),
    initialValues: PropTypes.object.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onSetSelectedItem: PropTypes.func.isRequired,
    onSetSelectedUser: PropTypes.func.isRequired,
    onSetSelectedProxy: PropTypes.func.isRequired,
    onSetSelectedInstance: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    setRequest: PropTypes.func,
    submitting: PropTypes.bool,
    patronGroups: PropTypes.arrayOf(PropTypes.object),
    selectedItem: PropTypes.object,
    selectedInstance: PropTypes.object,
    selectedUser: PropTypes.object,
    selectedProxy: PropTypes.object,
  };

  static defaultProps = {
    submitting: false,
  };

  constructor(props) {
    super(props);

    const {
      settings,
      initialValues,
    } = props;
    const { titleLevelRequestsFeatureEnabled } = getTlrSettings(settings?.items[0]?.value);

    this.state = {
      selectedLoan: EMPTY_RESOURCE_VALUE,
      isItemOrInstanceLoading: false,
      isItemsDialogOpen: false,
      isItemPreselected: false, // is item received from items dialog or received on edit page
      isInstancePreselected: false, // is instance received after clicking on TLR checkbox or received on edit page
      isUserPreselected: false, // is user received on edit page
      isItemIdRequest: false,
      requestTypes: {},
      isRequestTypesReceived: false,
      isRequestTypeLoading: false,
      fulfillmentPreference: initialValues.fulfillmentPreference,
      isDeliverySelected: isDelivery(initialValues.fulfillmentPreference),
      titleLevelRequestsFeatureEnabled,
    };
    this.accordionStatusRef = React.createRef();
    this.editMediatedRequestData = {};
  }

  componentDidMount() {
    const {
      isEditMode,
      request,
    } = this.props;

    if (isEditMode) {
      if (request) { // when user came from mediated request details page
        this.getRequestDataForEditing();
      } else { // when user reloads Edit mediated request page
        this.getRequestById();
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { settings } = this.props;
    const { settings: prevSettings } = prevProps;
    const newSettings = settings?.items[0]?.value;

    if (prevSettings?.items[0]?.value !== newSettings) {
      const { titleLevelRequestsFeatureEnabled } = getTlrSettings(newSettings);

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ titleLevelRequestsFeatureEnabled });
    }
  }

  getRequestDataForEditing = (request = this.props.request) => {
    const {
      onSetSelectedProxy,
      onSetSelectedInstance,
      onSetSelectedItem,
      onSetSelectedUser,
    } = this.props;
    const isTlr = request.requestLevel === MEDIATED_REQUEST_LEVEL.TITLE;

    if (isTlr && request.instance?.hrid) {
      this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, request.instance.hrid);
    } else if (request.item?.barcode) {
      this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, request.item.barcode);
      this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_ID, request.itemId);
    }

    this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_BARCODE, request.requester?.barcode);
    this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, request.requesterId);
    this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.PATRON_COMMENTS, request.patronComments);

    Promise.allSettled([
      isTlr ? this.findInstance(request.instanceId, false) : this.findItem(RESOURCE_KEYS.ID, request.itemId, false, false),
      this.findUser(RESOURCE_KEYS.ID, request.requesterId, false)
    ])
      .then((results) => {
        const resourceId = results[0]?.value?.id;
        const requesterId = results[1]?.value?.id;

        if (isTlr) {
          this.setState({
            isInstancePreselected: true,
            isUserPreselected: true,
          });
        } else {
          this.setState({
            isItemPreselected: true,
            isUserPreselected: true,
          });
        }

        if (isProxyFunctionalityAvailable() && request.proxy) {
          this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, request.proxyUserId);
          onSetSelectedProxy(request.proxy);
        }

        this.setRequestPreferencesForEditing(resourceId, requesterId, isTlr, request);
      })
      .catch(() => {
        if (isTlr) {
          onSetSelectedInstance(EMPTY_RESOURCE_VALUE);
        } else {
          onSetSelectedItem(EMPTY_RESOURCE_VALUE);
        }

        onSetSelectedUser(EMPTY_RESOURCE_VALUE);
      });
  }

  getRequestById = () => {
    const {
      findResource,
      match,
      setRequest,
    } = this.props;

    findResource(RESOURCE_TYPES.REQUEST_BY_ID, match.params?.id)
      .then(request => {
        setRequest(request);

        return request;
      })
      .then((request) => {
        this.getRequestDataForEditing(request);
      });
  }

  getAvailableRequestTypes = (user) => {
    const {
      selectedItem,
      selectedInstance,
      values,
      request,
      isEditMode,
    } = this.props;
    const isTitleLevelRequest = isEditMode ? request?.requestLevel === MEDIATED_REQUEST_LEVEL.TITLE : values?.createTitleLevelRequest;
    const selectedResource = getRequestInformation(isTitleLevelRequest, selectedInstance, selectedItem);

    if (selectedResource?.id && user?.id) {
      const resourceTypeId = getResourceTypeId(isTitleLevelRequest);

      this.findRequestTypes(selectedResource.id, user.id, resourceTypeId);
    }
  }

  getUserValidationData = (key, value) => {
    const { findResource } = this.props;

    this.setState({ isUserLoading: true });

    return findResource(RESOURCE_TYPES.USER, value, key)
      .then((result) => result.totalRecords)
      .catch(() => EMPTY_RESOURCE_VALUE)
      .finally(() => {
        this.setState({ isUserLoading: false });
      });
  }

  selectRequester = (requester) => {
    const {
      selectedUser: initialRequester,
      form,
      onSetSelectedProxy,
      onSetSelectedUser,
    } = this.props;

    if (initialRequester.id !== requester.id) {
      this.setState({
        requestTypes: {},
        isRequestTypesReceived: false,
      });
      onSetSelectedProxy(initialRequester);
      onSetSelectedUser(requester);
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, requester.id);
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_BARCODE, requester.barcode);
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, initialRequester.id);
      this.setRequestPreferences(requester.id);
      this.getAvailableRequestTypes(requester);
    }
  }

  handleCloseProxy = () => {
    this.props.onSetSelectedProxy(EMPTY_RESOURCE_VALUE);
  };

  findUser = (fieldName, value, shouldFetchAdditionalInfo = true) => {
    const {
      form,
      findResource,
      onSetSelectedUser,
      onSetSelectedProxy,
    } = this.props;
    const isProxyAvailable = isProxyFunctionalityAvailable();

    this.setState({
      isUserLoading: true,
      requestTypes: {},
      isRequestTypesReceived: false,
      isUserPreselected: false,
    });

    if (isProxyAvailable) {
      onSetSelectedProxy(EMPTY_RESOURCE_VALUE);
    }

    onSetSelectedUser(EMPTY_RESOURCE_VALUE);

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, EMPTY_MEDIATED_REQUEST_FORM_VALUE);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, EMPTY_MEDIATED_REQUEST_FORM_VALUE);

    if (isProxyAvailable) {
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, EMPTY_MEDIATED_REQUEST_FORM_VALUE);
    }

    return findResource(RESOURCE_TYPES.USER, value, fieldName)
      .then((result) => {
        if (result.totalRecords === 1) {
          const selectedUser = result.users[0];

          form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, selectedUser.id);
          form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER, selectedUser);
          onSetSelectedUser(selectedUser);

          if (fieldName === RESOURCE_KEYS.ID) {
            this.triggerUserBarcodeValidation();
          }

          if (shouldFetchAdditionalInfo) {
            this.setRequestPreferences(selectedUser.id);
          }

          return selectedUser;
        }

        return EMPTY_RESOURCE_VALUE;
      })
      .catch(() => {
        onSetSelectedUser(EMPTY_RESOURCE_VALUE);

        return EMPTY_RESOURCE_VALUE;
      })
      .then(user => {
        if (shouldFetchAdditionalInfo) {
          this.getAvailableRequestTypes(user);
        }

        return user;
      })
      .finally(() => {
        this.setState({ isUserLoading: false });
      });
  }

  findItemRelatedResources = (item) => {
    if (!item) {
      return EMPTY_RESOURCE_VALUE;
    }

    const { findResource } = this.props;

    return findResource(RESOURCE_TYPES.LOAN, item.id)
      .then((result) => {
        const selectedLoan = result?.loans?.[0];

        if (selectedLoan) {
          this.setState({ selectedLoan });
        }

        return item;
      })
      .catch(() => EMPTY_RESOURCE_VALUE);
  }

  setItemIdRequest = (key, isBarcodeRequired) => {
    const { isItemIdRequest } = this.state;

    if (key === RESOURCE_KEYS.ID && !isBarcodeRequired) {
      this.setState({ isItemIdRequest: true });
    } else if (key === RESOURCE_KEYS.BARCODE && isItemIdRequest) {
      this.setState({ isItemIdRequest: false });
    }
  };

  getItemValidationData = (key, value) => {
    const { findResource } = this.props;

    this.setState({ isItemOrInstanceLoading: true });

    return findResource(RESOURCE_TYPES.ITEM, value, key)
      .then((result) => result?.items?.length)
      .catch(() => EMPTY_RESOURCE_VALUE)
      .finally(() => {
        this.setState({ isItemOrInstanceLoading: false });
      });
  };

  findItem = (key, value, isBarcodeRequired = false, shouldGetRequestTypes = true) => {
    const {
      findResource,
      form,
      onSetSelectedItem,
      selectedUser,
    } = this.props;

    this.setState({
      isItemOrInstanceLoading: true,
      requestTypes: {},
      isRequestTypesReceived: false,
      isItemPreselected: false,
    });
    this.resetRequestPreference();

    return findResource(RESOURCE_TYPES.ITEM, value, key)
      .then((result) => {
        this.setItemIdRequest(key, isBarcodeRequired);

        if (!result || result?.items?.length === 0) {
          return EMPTY_RESOURCE_VALUE;
        }

        const foundItem = result.items?.find(item => item[key] === value);

        if (foundItem) {
          form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_ID, foundItem.id);
          form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, foundItem.barcode);
          resetFieldState(form, MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE);
          onSetSelectedItem(foundItem);
        }

        return foundItem || EMPTY_RESOURCE_VALUE;
      })
      .catch(() => {
        onSetSelectedItem(EMPTY_RESOURCE_VALUE);

        return EMPTY_RESOURCE_VALUE;
      })
      .then(item => {
        if (item && selectedUser?.id && shouldGetRequestTypes) {
          this.findRequestTypes(item.id, selectedUser.id, ID_TYPE_MAP.ITEM_ID);
        }

        return item;
      })
      .then(item => {
        this.findItemRelatedResources(item);

        return item;
      })
      .finally(() => {
        this.setState({ isItemOrInstanceLoading: false });
      });
  }

  getInstanceValidationData = async (instanceId) => {
    const { findResource } = this.props;

    this.setState({ isItemOrInstanceLoading: true });

    return findResource(RESOURCE_TYPES.INSTANCE, instanceId)
      .then((result) => Boolean(result?.id))
      .catch(() => EMPTY_RESOURCE_VALUE)
      .finally(() => {
        this.setState({ isItemOrInstanceLoading: false });
      });
  }

  findInstance = async (instanceId, shouldGetRequestTypes = true) => {
    const {
      findResource,
      form,
      onSetSelectedInstance,
      selectedUser,
    } = this.props;

    this.setState({
      isItemOrInstanceLoading: true,
      requestTypes: {},
      isRequestTypesReceived: false,
      isInstancePreselected: false,
    });
    this.resetRequestPreference();

    return findResource(RESOURCE_TYPES.INSTANCE, instanceId)
      .then((instance) => {
        if (!instance?.id) {
          return EMPTY_RESOURCE_VALUE;
        }

        form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, instance.id);
        form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, instance.hrid);
        resetFieldState(form, MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE);
        onSetSelectedInstance(instance);

        return instance;
      })
      .catch(() => {
        onSetSelectedInstance(EMPTY_RESOURCE_VALUE);

        return EMPTY_RESOURCE_VALUE;
      })
      .then(instance => {
        if (instance && selectedUser?.id && shouldGetRequestTypes) {
          this.findRequestTypes(instance.id, selectedUser.id, ID_TYPE_MAP.INSTANCE_ID);
        }

        return instance;
      })
      .finally(() => {
        this.setState({ isItemOrInstanceLoading: false });
      });
  }

  triggerItemBarcodeValidation = () => {
    const {
      form,
      values,
    } = this.props;

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.KEY_OF_ITEM_BARCODE_FIELD, values.keyOfItemBarcodeField ? 0 : 1);
  };

  triggerUserBarcodeValidation = () => {
    const {
      form,
      values,
    } = this.props;

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.KEY_OF_USER_BARCODE_FIELD, values.keyOfUserBarcodeField ? 0 : 1);
  };

  triggerInstanceIdValidation = () => {
    const {
      form,
      values,
    } = this.props;

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.KEY_OF_INSTANCE_ID_FIELD, values.keyOfInstanceIdField ? 0 : 1);
  };

  triggerRequestTypeValidation = () => {
    const {
      form,
      values,
    } = this.props;

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.KEY_OF_REQUEST_TYPE_FIELD, values.keyOfRequestTypeField ? 0 : 1);
  };

  handleTlrCheckboxChange = (event) => {
    const isCreateTlr = event.target.checked;
    const {
      form,
      selectedItem,
      selectedInstance,
      onSetSelectedItem,
      onSetSelectedInstance,
    } = this.props;

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.CREATE_TLR, isCreateTlr);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, EMPTY_MEDIATED_REQUEST_FORM_VALUE);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, EMPTY_MEDIATED_REQUEST_FORM_VALUE);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, EMPTY_MEDIATED_REQUEST_FORM_VALUE);

    if (isCreateTlr) {
      this.setState({
        requestTypes: {},
        isRequestTypesReceived: false,
      });

      if (selectedItem) {
        this.findInstance(selectedItem.instanceId)
          .then(() => {
            this.setState({ isInstancePreselected: true });
          });
      }

      onSetSelectedItem(EMPTY_RESOURCE_VALUE);
    } else if (selectedInstance) {
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);
      resetFieldState(form, MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE);
      this.setState({ isItemsDialogOpen: true });
    } else {
      onSetSelectedInstance(EMPTY_RESOURCE_VALUE);
      this.setState({
        requestTypes: {},
        isRequestTypesReceived: false,
      });
    }
  };

  handleItemsDialogClose = () => {
    const { onSetSelectedInstance } = this.props;

    onSetSelectedInstance(EMPTY_RESOURCE_VALUE);
    this.setState({
      isItemsDialogOpen: false,
      isItemIdRequest: false,
      requestTypes: {},
      isRequestTypesReceived: false,
    }, this.triggerItemBarcodeValidation);
  }

  handleInstanceItemClick = (event, item) => {
    const { onSetSelectedInstance } = this.props;
    let isBarcodeRequired = false;

    onSetSelectedInstance(EMPTY_RESOURCE_VALUE);
    this.setState({
      isItemsDialogOpen: false,
      requestTypes: {},
    });

    if (item?.barcode) {
      isBarcodeRequired = true;
      this.setState({ isItemIdRequest: false });
    }

    this.findItem(RESOURCE_KEYS.ID, item.id, isBarcodeRequired)
      .then(() => {
        this.setState({ isItemPreselected: true });
      });
  }

  handleCancelAndClose = () => {
    const { isItemsDialogOpen } = this.state;
    const { onCancel } = this.props;
    const keepEditBtn = document.getElementById('clickable-cancel-editing-confirmation-confirm');

    if (isItemsDialogOpen) {
      handleKeyCommand(this.handleItemsDialogClose);
    } else if (keepEditBtn) {
      keepEditBtn.click();
    } else {
      onCancel();
    }
  };

  getRequestPreferences = async (userId) => {
    const {
      findResource,
      initialValues,
    } = this.props;
    const defaultPreferences = getDefaultRequestPreferences(initialValues);

    try {
      const { requestPreferences } = await findResource(RESOURCE_TYPES.REQUEST_PREFERENCES, userId);
      const preferences = requestPreferences[0];
      const fulfillmentPreference = getFulfillmentPreference(preferences, initialValues);
      const defaultDeliveryAddressTypeId = preferences?.defaultDeliveryAddressTypeId;
      const defaultServicePointId = preferences?.defaultServicePointId;

      this.setState({
        defaultDeliveryAddressTypeId,
        defaultServicePointId,
        fulfillmentPreference,
      });

      return {
        ...defaultPreferences,
        hasDelivery: Boolean(preferences?.delivery),
        isDeliverySelected: isDelivery(fulfillmentPreference),
        selectedAddress: defaultDeliveryAddressTypeId,
        defaultDeliveryAddressTypeId,
        defaultServicePointId,
        fulfillmentPreference,
      };
    } catch (e) {
      return defaultPreferences;
    }
  };

  setRequestPreferences = async (userId) => {
    const {
      form,
    } = this.props;
    const requestPreference = await this.getRequestPreferences(userId);

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, requestPreference.fulfillmentPreference);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, requestPreference.defaultServicePointId);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, requestPreference.defaultDeliveryAddressTypeId);

    this.setState({
      hasDelivery: requestPreference.hasDelivery,
      isDeliverySelected: requestPreference.isDeliverySelected,
    });
  }

  setEditFormValue = (fieldName, value) => {
    const { form } = this.props;

    form.change(fieldName, value);
    set(this.editMediatedRequestData, fieldName, value);
  };

  setRequestPreferencesForEditing = (resourceId, requesterId, isTlr, request) => {
    const { selectedUser } = this.props;

    if (resourceId && requesterId) {
      const resourceType = isTlr ? ID_TYPE_MAP.INSTANCE_ID : ID_TYPE_MAP.ITEM_ID;

      Promise.allSettled([
        this.getRequestPreferences(requesterId),
        this.findRequestTypes(resourceId, requesterId, resourceType)
      ])
        .then((response) => {
          const requestPreferences = response[0]?.value;
          const requestTypes = response[1]?.value;

          if (requestTypes?.[request.requestType]) { // when request type, fulfilment preference, pickup sp/delivery address were saved before
            this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, request.requestType);

            if (request.fulfillmentPreference === FULFILMENT_TYPES.HOLD_SHELF) {
              this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, request.fulfillmentPreference);
              this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, requestPreferences.defaultDeliveryAddressTypeId);
              this.setState({ hasDelivery: requestPreferences.hasDelivery });

              // check if previously saved service point exists in list of available service points
              const selectedServicePoint = requestTypes[request.requestType]?.find(servicePoint => servicePoint.id === request.pickupServicePointId);

              if (selectedServicePoint) {
                this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, request.pickupServicePointId);
              }
            } else if (request.fulfillmentPreference === FULFILMENT_TYPES.DELIVERY && requestPreferences.hasDelivery) {
              this.setState({
                isDeliverySelected: true,
                hasDelivery: true,
              });

              this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, request.fulfillmentPreference);
              this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, requestPreferences.defaultServicePointId);

              // check if previously saved address exists in user's address list
              const selectedDeliveryAddress = selectedUser.personal.addresses?.find(address => request.deliveryAddressTypeId === address.addressTypeId);

              this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, selectedDeliveryAddress?.addressTypeId || requestPreferences.defaultDeliveryAddressTypeId);
            }
          } else { // when request type, fulfilment preference, pickup SP/delivery address were not saved before
            this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, requestPreferences.fulfillmentPreference);
            this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, requestPreferences.defaultServicePointId);
            this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, requestPreferences.defaultDeliveryAddressTypeId);
            this.setState({
              hasDelivery: requestPreferences.hasDelivery,
              isDeliverySelected: requestPreferences.isDeliverySelected,
            });
          }
        })
        .catch(() => {
          this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);
          this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, EMPTY_MEDIATED_REQUEST_FORM_VALUE);
          this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, EMPTY_MEDIATED_REQUEST_FORM_VALUE);
          this.setEditFormValue(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, EMPTY_MEDIATED_REQUEST_FORM_VALUE);
        })
        .then(this.resetEditMediatedRequestForm);
    } else {
      this.resetEditMediatedRequestForm();
    }
  };

  /* resetting form values for edit mediated request page let us click "Cancel" button
     or cross at the left top corner without having "Are you sure?" modal.
     Form resetting happens only once and only after first loading of "Edit mediated request" page */
  resetEditMediatedRequestForm = () => {
    this.props.form.reset(this.editMediatedRequestData);
  };

  findRequestTypes = (resourceId, requesterId, resourceType) => {
    const {
      findResource,
      form,
    } = this.props;
    const requestParams = {
      operation: MEDIATED_REQUEST_OPERATIONS.CREATE,
      [resourceType]: resourceId,
      requesterId,
    };
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);

    this.setState({
      isRequestTypeLoading: true,
      requestTypes: {},
    });

    return findResource(RESOURCE_TYPES.REQUEST_TYPES, requestParams)
      .then(requestTypes => {
        if (!isEmpty(requestTypes)) {
          this.setState({
            requestTypes,
            isRequestTypesReceived: true,
          }, this.triggerRequestTypeValidation);
        } else {
          this.setState({ isRequestTypesReceived: true }, this.triggerRequestTypeValidation);
        }

        return requestTypes;
      })
      .catch(() => {
        this.setState({ requestTypes: {} });
      })
      .finally(() => {
        this.setState({ isRequestTypeLoading: false });
      });
  }

  setDeliveryAddress = (isDeliverySelected) => {
    this.setState({ isDeliverySelected });
  }

  resetRequestPreference = () => {
    const {
      defaultDeliveryAddressTypeId,
      defaultServicePointId,
      fulfillmentPreference,
    } = this.state;
    const { form } = this.props;
    const isDeliverySelected = isDelivery(fulfillmentPreference);

    this.setState({ isDeliverySelected });
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, fulfillmentPreference);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, defaultDeliveryAddressTypeId);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, defaultServicePointId);
  };

  handleDataSubmit = (e) => {
    e.preventDefault();

    const {
      submitInitiator,
      handleSubmit,
    } = this.props;

    if (e.nativeEvent?.submitter?.id === SAVE_BUTTON_ID) {
      submitInitiator.current = SAVE_BUTTON_ID;
    } else {
      submitInitiator.current = CONFIRM_BUTTON_ID;
    }

    handleSubmit();
  }

  render() {
    const {
      selectedLoan,
      isUserLoading,
      isItemOrInstanceLoading,
      isItemsDialogOpen,
      isItemIdRequest,
      titleLevelRequestsFeatureEnabled,
      isRequestTypesReceived,
      isRequestTypeLoading,
      requestTypes,
      isDeliverySelected,
      hasDelivery,
      defaultDeliveryAddressTypeId,
      isItemPreselected,
      isInstancePreselected,
      isUserPreselected,
    } = this.state;
    const {
      handleSubmit,
      request,
      form,
      patronGroups,
      submitting,
      selectedItem,
      selectedUser,
      selectedProxy,
      selectedInstance,
      values,
      onCancel,
      onSetSelectedItem,
      onSetSelectedInstance,
      onSetSelectedUser,
      onSetSelectedProxy,
      addressTypes,
      isEditMode,
    } = this.props;
    let addressDetail;
    const { createTitleLevelRequest } = values;
    const patronGroup = getPatronGroup(selectedUser, patronGroups);
    const isTitleLevelRequest = isEditMode ? request?.requestLevel === MEDIATED_REQUEST_LEVEL.TITLE : createTitleLevelRequest;
    const isTlrCheckboxDisabled = !titleLevelRequestsFeatureEnabled || isItemOrInstanceLoading;
    const requestTypeOptions = getRequestTypesOptions(requestTypes);
    const fulfillmentTypeOptions = getFulfillmentTypeOptions(hasDelivery, FULFILMENT_TYPES_MAP);
    const isFulfilmentPreferenceVisible = values.requestType && !isRequestTypeLoading && isRequestTypesReceived;
    const {
      deliveryLocations,
      deliveryLocationsDetail,
    } = getDeliveryInformation(selectedUser, addressTypes);
    const isSaveAndCloseButtonDisabled = submitting || !(isTitleLevelRequest ? selectedInstance?.id : selectedItem?.id) || !selectedUser?.id;
    const isConfirmButtonDisabled = isSaveAndCloseButtonDisabled || !values.requestType || !(isDeliverySelected ? values.deliveryAddressTypeId : values.pickupServicePointId);
    const paneTitle = isEditMode ? <FormattedMessage id="ui-requests-mediated.form.edit.title" /> : <FormattedMessage id="ui-requests-mediated.form.create.title" />;
    const isTlrCheckboxVisible = titleLevelRequestsFeatureEnabled && !isEditMode;
    const isMaterialInformationVisible = !isEditMode || (isEditMode && request);

    if (values[MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID]) {
      addressDetail = <AddressDetails address={deliveryLocationsDetail[values[MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID]]} />;
    }

    return (
      <Paneset isRoot>
        <RequestFormShortcutsWrapper
          onSubmit={handleSubmit}
          onCancel={this.handleCancelAndClose}
          accordionStatusRef={this.accordionStatusRef}
          isSubmittingDisabled={submitting}
        >
          <form
            id="requestsMediatedForm"
            className={css.requestForm}
            onSubmit={this.handleDataSubmit}
            noValidate
          >
            <Pane
              id="requestsMediatedPane"
              defaultWidth="100%"
              height="100%"
              firstMenu={<RequestFormFirstMenu onCancel={onCancel} />}
              paneTitle={paneTitle}
              footer={
                <RequestFormFooter
                  onCancel={onCancel}
                  isSaveAndCloseButtonDisabled={isSaveAndCloseButtonDisabled}
                  isConfirmButtonDisabled={isConfirmButtonDisabled}
                />
              }
            >
              {
                isTlrCheckboxVisible &&
                  <div className={css.tlrCheckbox}>
                    <Row>
                      <Col xs={12}>
                        <Field
                          data-testid="tlrCheckbox"
                          type="checkbox"
                          name={MEDIATED_REQUEST_FORM_FIELD_NAMES.CREATE_TLR}
                          label={<FormattedMessage id="ui-requests-mediated.form.tlrCheckboxLabel" />}
                          component={Checkbox}
                          checked={isTitleLevelRequest}
                          disabled={isTlrCheckboxDisabled}
                          onChange={this.handleTlrCheckboxChange}
                        />
                      </Col>
                    </Row>
                  </div>
              }
              <AccordionStatus ref={this.accordionStatusRef}>
                <AccordionSet>
                  {isMaterialInformationVisible &&
                    (isTitleLevelRequest
                      ? (
                        <Accordion
                          id="instanceAccordion"
                          label={<FormattedMessage id="ui-requests-mediated.form.instance.accordionLabel" />}
                        >
                          <InstanceInformation
                            selectedInstance={selectedInstance}
                            isInstancePreselected={isInstancePreselected}
                            triggerValidation={this.triggerInstanceIdValidation}
                            findInstance={this.findInstance}
                            getInstanceValidationData={this.getInstanceValidationData}
                            submitting={submitting}
                            form={form}
                            values={values}
                            onSetSelectedInstance={onSetSelectedInstance}
                            isLoading={isItemOrInstanceLoading}
                            enterButtonClass={css.enterButton}
                            isEditMode={isEditMode}
                            request={request}
                          />
                        </Accordion>
                      )
                      : (
                        <Accordion
                          id="itemAccordion"
                          label={<FormattedMessage id="ui-requests-mediated.form.item.accordionLabel" />}
                        >
                          <ItemInformation
                            request={request}
                            form={form}
                            selectedItem={selectedItem}
                            isItemPreselected={isItemPreselected}
                            isItemIdRequest={isItemIdRequest}
                            triggerValidation={this.triggerItemBarcodeValidation}
                            findItem={this.findItem}
                            getItemValidationData={this.getItemValidationData}
                            submitting={submitting}
                            onSetSelectedItem={onSetSelectedItem}
                            values={values}
                            selectedLoan={selectedLoan}
                            isLoading={isItemOrInstanceLoading}
                            enterButtonClass={css.enterButton}
                            isEditMode={isEditMode}
                          />
                        </Accordion>
                      )
                    )
                  }
                  <Accordion
                    id="requesterAccordion"
                    label={<FormattedMessage id="ui-requests-mediated.form.requester.accordionLabel" />}
                  >
                    <RequesterInformation
                      request={request}
                      submitting={submitting}
                      form={form}
                      values={values}
                      selectedUser={selectedUser}
                      onSetSelectedUser={onSetSelectedUser}
                      onSetSelectedProxy={onSetSelectedProxy}
                      patronGroup={patronGroup}
                      isLoading={isUserLoading}
                      findUser={this.findUser}
                      selectRequester={this.selectRequester}
                      handleCloseProxy={this.handleCloseProxy}
                      proxy={selectedProxy}
                      getUserValidationData={this.getUserValidationData}
                      triggerUserBarcodeValidation={this.triggerUserBarcodeValidation}
                      enterButtonClass={css.enterButton}
                      isEditMode={isEditMode}
                      isUserPreselected={isUserPreselected}
                    />
                  </Accordion>
                  <Accordion
                    id="requestInformationAccordion"
                    label={<FormattedMessage id="ui-requests-mediated.form.request.accordionLabel" />}
                  >
                    <RequestInformation
                      request={request}
                      requestTypeOptions={requestTypeOptions}
                      isTitleLevelRequest={isTitleLevelRequest}
                      isRequestTypesReceived={isRequestTypesReceived}
                      isRequestTypeLoading={isRequestTypeLoading}
                      isSelectedInstance={Boolean(selectedInstance?.id)}
                      isSelectedItem={Boolean(selectedItem?.id)}
                      isSelectedUser={Boolean(selectedUser?.id)}
                      values={values}
                      isEditMode={isEditMode}
                    />
                    {isFulfilmentPreferenceVisible &&
                      <FulfilmentPreference
                        requestTypes={requestTypes}
                        isDeliverySelected={isDeliverySelected}
                        deliveryAddress={addressDetail}
                        setDeliveryAddress={this.setDeliveryAddress}
                        deliveryLocations={deliveryLocations}
                        fulfillmentTypeOptions={fulfillmentTypeOptions}
                        defaultDeliveryAddressTypeId={defaultDeliveryAddressTypeId}
                        request={request}
                        form={form}
                        values={values}
                      />
                    }
                  </Accordion>
                </AccordionSet>
              </AccordionStatus>
              <ItemsDialog
                onClose={this.handleItemsDialogClose}
                onRowClick={this.handleInstanceItemClick}
                instanceId={selectedInstance?.id}
                title={selectedInstance?.title}
                open={isItemsDialogOpen}
              />
            </Pane>
          </form>
        </RequestFormShortcutsWrapper>
      </Paneset>
    );
  }
}

export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    values: true,
  },
})(RequestForm);
