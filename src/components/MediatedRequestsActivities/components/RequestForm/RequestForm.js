import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { parse } from 'query-string';
import {
  isEqual,
  isEmpty,
  pick,
  get,
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
} from '../../../../constants';
import {
  handleKeyCommand,
  getPatronGroup,
  getTlrSettings,
  isSubmittingButtonDisabled,
  isFormEditing,
  resetFieldState,
  getFulfillmentTypeOptions,
  getDefaultRequestPreferences,
  getFulfillmentPreference,
  getSelectedAddressTypeId,
  isDeliverySelected,
  getRequestTypesOptions,
  getDeliveryInformation,
  getResourceTypeId,
  getRequestInformation,
  getRequester,
} from '../../../../utils';

import css from './RequestForm.css';

class RequestForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    findResource: PropTypes.func.isRequired,
    onSetSubmitInitiator: PropTypes.func.isRequired,
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
    onSetSelectedInstance: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    patronGroups: PropTypes.arrayOf(PropTypes.object),
    selectedItem: PropTypes.object,
    selectedInstance: PropTypes.object,
    selectedUser: PropTypes.object,
    selectedProxy: PropTypes.object,
  };

  static defaultProps = {
    pristine: true,
    submitting: false,
  };

  constructor(props) {
    super(props);

    const {
      request,
      settings,
      initialValues,
    } = props;
    const { loan } = (request || {});
    const { titleLevelRequestsFeatureEnabled } = getTlrSettings(settings?.items[0]?.value);

    this.state = {
      selectedLoan: loan,
      isItemOrInstanceLoading: false,
      isItemsDialogOpen: false,
      isItemFromItemsDialog: false, // is item received from items dialog
      isInstanceFromItem: false, // is instance received after clicking on TLR checkbox
      isItemIdRequest: this.isItemIdProvided(),
      requestTypes: {},
      isRequestTypesReceived: false,
      isRequestTypeLoading: false,
      shouldValidate: false,
      titleLevelRequestsFeatureEnabled,
      ...getDefaultRequestPreferences(initialValues),
    };
    this.accordionStatusRef = React.createRef();
  }

  componentDidMount() {
    this.setTlrCheckboxInitialState();
  }

  componentDidUpdate(prevProps) {
    const {
      initialValues,
      request,
      onSetSelectedItem,
      onSetSelectedUser,
      settings,
    } = this.props;
    const {
      initialValues: prevInitialValues,
      request: prevRequest,
      settings: prevSettings,
    } = prevProps;
    const newSettings = settings?.items[0]?.value;

    if (
      (initialValues?.fulfillmentPreference && !prevInitialValues?.fulfillmentPreference) ||
      !isEqual(request, prevRequest)
    ) {
      onSetSelectedItem(request.item);
      onSetSelectedUser(request.requester);

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selectedLoan: request.loan });
    }

    if (prevSettings?.items[0]?.value !== newSettings) {
      const { titleLevelRequestsFeatureEnabled } = getTlrSettings(newSettings);

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ titleLevelRequestsFeatureEnabled }, this.setTlrCheckboxInitialState);
    }
  }

  isItemIdProvided = () => {
    const { location } = this.props;
    const { itemId } = parse(location?.search);

    return Boolean(itemId);
  }

  setTlrCheckboxInitialState = () => {
    const { titleLevelRequestsFeatureEnabled } = this.state;
    const {
      form,
      location,
    } = this.props;
    const {
      itemId,
      itemBarcode,
      instanceId,
    } = parse(location?.search);

    if (titleLevelRequestsFeatureEnabled === false) {
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.CREATE_TLR, false);

      return;
    }

    if (itemId || itemBarcode) {
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.CREATE_TLR, false);
    } else if (instanceId) {
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.CREATE_TLR, true);
    }
  }

  getAvailableRequestTypes = (user) => {
    const {
      selectedItem,
      selectedInstance,
      values,
    } = this.props;
    const {
      selectedResource,
      isTitleLevelRequest,
    } = getRequestInformation(values, selectedInstance, selectedItem);

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
      .catch(() => null)
      .finally(() => {
        this.setState({ isUserLoading: false });
      });
  }

  selectProxy = (proxy) => {
    const {
      form,
      selectedUser,
      onSetSelectedProxy,
    } = this.props;

    if (selectedUser.id !== proxy.id) {
      this.setState({
        requestTypes: {},
        isRequestTypesReceived: false,
      });
      onSetSelectedProxy(proxy);
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, proxy.id);
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, selectedUser.id);
      this.findRequestPreferences(proxy.id);
      this.getAvailableRequestTypes(proxy);
    }
  }

  handleCloseProxy = () => {
    this.props.onSetSelectedProxy(null);
  };

  findUser = (fieldName, value) => {
    const {
      form,
      findResource,
      onSetSelectedUser,
      onSetSelectedProxy,
    } = this.props;

    this.setState({
      isUserLoading: true,
      requestTypes: {},
      isRequestTypesReceived: false,
    });
    onSetSelectedProxy(null);

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, undefined);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, undefined);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, undefined);

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

          this.findRequestPreferences(selectedUser.id);

          return selectedUser;
        }

        return null;
      })
      .catch(() => {
        onSetSelectedUser(null);

        return null;
      })
      .then(user => {
        this.getAvailableRequestTypes(user);

        return user;
      })
      .finally(() => {
        this.setState({ isUserLoading: false });
      });
  }

  findItemRelatedResources = (item) => {
    const { findResource } = this.props;

    if (!item) {
      return null;
    }

    return Promise.all([findResource(RESOURCE_TYPES.LOAN, item.id)])
      .then((results) => {
        const selectedLoan = results[0]?.loans?.[0];

        this.setState({ selectedLoan });

        return item;
      });
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
      .catch(() => null)
      .finally(() => {
        this.setState({ isItemOrInstanceLoading: false });
      });
  };

  findItem = (key, value, isBarcodeRequired = false) => {
    const {
      isItemOrInstanceLoading,
    } = this.state;
    const {
      findResource,
      form,
      onSetSelectedItem,
      selectedUser,
      selectedProxy,
    } = this.props;

    this.setState({
      isItemOrInstanceLoading: true,
      requestTypes: {},
      isRequestTypesReceived: false,
      isItemFromItemsDialog: false,
    });

    return findResource(RESOURCE_TYPES.ITEM, value, key)
      .then((result) => {
        this.setItemIdRequest(key, isBarcodeRequired);

        if (!result || result?.items?.length === 0) {
          return null;
        }

        const foundItem = result.items?.find(item => item[key] === value);

        form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_ID, foundItem.id);
        form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, foundItem.barcode);
        resetFieldState(form, MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE);
        onSetSelectedItem(foundItem);
        this.setState({ isItemOrInstanceLoading: false });

        return foundItem;
      })
      .catch(() => {
        onSetSelectedItem(null);

        return null;
      })
      .then(item => {
        if (item && selectedUser?.id) {
          const requester = getRequester(selectedProxy, selectedUser);
          this.findRequestTypes(item.id, requester.id, ID_TYPE_MAP.ITEM_ID);
        }

        return item;
      })
      .then(item => this.findItemRelatedResources(item))
      .finally(() => {
        if (isItemOrInstanceLoading) {
          this.setState({ isItemOrInstanceLoading: false });
        }
      });
  }

  getInstanceValidationData = async (instanceId) => {
    const { findResource } = this.props;

    this.setState({ isItemOrInstanceLoading: true });

    return findResource(RESOURCE_TYPES.INSTANCE, instanceId)
      .then((result) => Boolean(result?.id))
      .catch(() => null)
      .finally(() => {
        this.setState({ isItemOrInstanceLoading: false });
      });
  }

  findInstance = async (instanceId) => {
    const {
      isItemOrInstanceLoading,
    } = this.state;
    const {
      findResource,
      form,
      onSetSelectedInstance,
      selectedUser,
      selectedProxy,
    } = this.props;

    this.setState({
      isItemOrInstanceLoading: true,
      requestTypes: {},
      isRequestTypesReceived: false,
      isInstanceFromItem: false,
    });

    return findResource(RESOURCE_TYPES.INSTANCE, instanceId)
      .then((instance) => {
        if (!instance?.id) {
          return null;
        }

        form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, instance.id);
        form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, instance.hrid);
        resetFieldState(form, MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE);
        onSetSelectedInstance(instance);
        this.setState({ isItemOrInstanceLoading: false });

        return instance;
      })
      .catch(() => {
        onSetSelectedInstance(null);

        return null;
      })
      .then(instance => {
        if (instance && selectedUser?.id) {
          const requester = getRequester(selectedProxy, selectedUser);
          this.findRequestTypes(instance.id, requester.id, ID_TYPE_MAP.INSTANCE_ID);
        }

        return instance;
      })
      .finally(() => {
        if (isItemOrInstanceLoading) {
          this.setState({ isItemOrInstanceLoading: false });
        }
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
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, null);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, null);
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, null);

    if (isCreateTlr) {
      this.setState({
        requestTypes: {},
        isRequestTypesReceived: false,
      });

      if (selectedItem) {
        this.findInstance(selectedItem.instanceId)
          .then(() => {
            this.setState({ isInstanceFromItem: true });
          });
      }

      onSetSelectedItem(undefined);
    } else if (selectedInstance) {
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);
      resetFieldState(form, MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE);
      this.setState({ isItemsDialogOpen: true });
    } else {
      onSetSelectedInstance(undefined);
      this.setState({
        requestTypes: {},
        isRequestTypesReceived: false,
      });
    }
  };

  handleItemsDialogClose = () => {
    const { onSetSelectedInstance } = this.props;

    onSetSelectedInstance(undefined);
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

    onSetSelectedInstance(undefined);
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
        this.setState({ isItemFromItemsDialog: true });
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

  findRequestPreferences = async (userId) => {
    const {
      findResource,
      form,
      initialValues,
    } = this.props;

    try {
      const { requestPreferences } = await findResource(RESOURCE_TYPES.REQUEST_PREFERENCES, userId, 'userId');
      const preferences = requestPreferences[0];
      const defaultPreferences = getDefaultRequestPreferences(initialValues);
      const requestPreference = {
        ...defaultPreferences,
        ...pick(preferences, ['defaultDeliveryAddressTypeId', 'defaultServicePointId']),
      };

      requestPreference.hasDelivery = get(preferences, 'delivery');

      const fulfillmentPreference = getFulfillmentPreference(preferences, initialValues);
      const deliverySelected = isDeliverySelected(fulfillmentPreference);
      const selectedAddress = requestPreference.selectedAddressTypeId || requestPreference.defaultDeliveryAddressTypeId;
      const selectedAddressTypeId = getSelectedAddressTypeId(deliverySelected, selectedAddress);

      this.setState({
        ...requestPreference,
        deliverySelected,
        selectedAddressTypeId,
      }, () => {
        form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, fulfillmentPreference);

        this.updateRequestPreferencesFields();
      });
    } catch (e) {
      this.setState({
        ...getDefaultRequestPreferences(initialValues),
        deliverySelected: false,
      }, () => {
        form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.FULFILLMENT_PREFERENCE, FULFILMENT_TYPES.HOLD_SHELF);
      });
    }
  }

  updateRequestPreferencesFields = () => {
    const {
      defaultDeliveryAddressTypeId,
      defaultServicePointId,
      deliverySelected,
      selectedAddressTypeId,
    } = this.state;
    const { form } = this.props;

    if (deliverySelected) {
      const deliveryAddressTypeId = selectedAddressTypeId || defaultDeliveryAddressTypeId;

      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, deliveryAddressTypeId);
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, '');
    } else {
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, defaultServicePointId);
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, '');
    }
  }

  findRequestTypes = (resourceId, requesterId, resourceType) => {
    const {
      findResource,
      form,
      request,
    } = this.props;
    const isEditForm = isFormEditing(request);
    let requestParams;

    if (isEditForm) {
      requestParams = {
        operation: MEDIATED_REQUEST_OPERATIONS.REPLACE,
        requestId: request.id,
      };
    } else {
      requestParams = {
        operation: MEDIATED_REQUEST_OPERATIONS.CREATE,
        [resourceType]: resourceId,
        requesterId,
      };
      form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);
    }

    this.setState({ isRequestTypeLoading: true });
    this.resetDeliveryPoint();

    findResource(RESOURCE_TYPES.REQUEST_TYPES, requestParams)
      .then(requestTypes => {
        if (!isEmpty(requestTypes)) {
          this.setState({
            requestTypes,
            isRequestTypesReceived: true,
          }, this.triggerRequestTypeValidation);
        } else {
          this.setState({ isRequestTypesReceived: true }, this.triggerRequestTypeValidation);
        }
      })
      .catch(() => {
        this.setState({ requestTypes: {} });
      })
      .finally(() => {
        this.setState({ isRequestTypeLoading: false });
      });
  }

  onChangeAddress = (e) => {
    const { form } = this.props;
    const selectedAddressTypeId = e.target.value;

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, selectedAddressTypeId);
    this.setState({ selectedAddressTypeId });
  }

  setDeliveryAddress = (deliverySelected, selectedAddressTypeId) => {
    this.setState({
      deliverySelected,
      selectedAddressTypeId,
    }, () => {
      this.updateRequestPreferencesFields();
    });
  }

  resetDeliveryPoint = () => {
    const { form } = this.props;

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, '');
    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, '');
  };

  sendData = (isValidationRequired) => {
    const {
      form,
      values,
      handleSubmit,
    } = this.props;

    this.setState({ shouldValidate: isValidationRequired }, async () => {
      await form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.KEY_OF_REQUEST_TYPE_FIELD, values.keyOfRequestTypeField ? 0 : 1);
      handleSubmit();
    });
  }

  handleDataSubmit = (e) => {
    e.preventDefault();

    const { onSetSubmitInitiator } = this.props;

    if (e.nativeEvent?.submitter?.id === SAVE_BUTTON_ID) {
      onSetSubmitInitiator(SAVE_BUTTON_ID);
      this.sendData(false);
    } else {
      onSetSubmitInitiator(null);
      this.sendData(true);
    }
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
      deliverySelected,
      selectedAddressTypeId,
      hasDelivery,
      defaultDeliveryAddressTypeId,
      shouldValidate,
      isItemFromItemsDialog,
      isInstanceFromItem,
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
      pristine,
      onSetSelectedItem,
      onSetSelectedInstance,
      onSetSelectedUser,
      onSetSelectedProxy,
      addressTypes,
    } = this.props;
    let addressDetail;
    const isEditForm = isFormEditing(request);
    const { createTitleLevelRequest } = values;
    const requester = getRequester(selectedProxy, selectedUser);
    const patronGroup = getPatronGroup(requester, patronGroups);
    const isSubmittingDisabled = isSubmittingButtonDisabled(pristine, submitting);
    const isTitleLevelRequest = createTitleLevelRequest || request?.requestLevel === MEDIATED_REQUEST_LEVEL.TITLE;
    const isTlrCheckboxDisabled = !titleLevelRequestsFeatureEnabled || isItemOrInstanceLoading;
    const requestTypeOptions = getRequestTypesOptions(requestTypes);
    const fulfillmentTypeOptions = getFulfillmentTypeOptions(hasDelivery, FULFILMENT_TYPES_MAP);
    const isFulfilmentPreferenceVisible = (values.requestType || isEditForm) && !isRequestTypeLoading && isRequestTypesReceived;
    const {
      deliveryLocations,
      deliveryLocationsDetail,
    } = getDeliveryInformation(requester, addressTypes);
    const isSaveAndCloseButtonDisabled = isSubmittingDisabled || !(isTitleLevelRequest ? selectedInstance?.id : selectedItem?.id) || !selectedUser?.id;
    const isConfirmButtonDisabled = isSaveAndCloseButtonDisabled || !values?.requestType || !(deliverySelected ? values?.deliveryAddressTypeId : values?.pickupServicePointId);

    if (selectedAddressTypeId) {
      addressDetail = <AddressDetails address={deliveryLocationsDetail[selectedAddressTypeId]} />;
    }

    return (
      <Paneset isRoot>
        <RequestFormShortcutsWrapper
          onSubmit={handleSubmit}
          onCancel={this.handleCancelAndClose}
          accordionStatusRef={this.accordionStatusRef}
          isSubmittingDisabled={isSubmittingDisabled}
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
              paneTitle={<FormattedMessage id="ui-requests-mediated.form.title" />}
              footer={
                <RequestFormFooter
                  onCancel={onCancel}
                  isSaveAndCloseButtonDisabled={isSaveAndCloseButtonDisabled}
                  isConfirmButtonDisabled={isConfirmButtonDisabled}
                />
              }
            >
              {
                titleLevelRequestsFeatureEnabled &&
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
                  {
                    isTitleLevelRequest
                      ? (
                        <Accordion
                          id="instanceAccordion"
                          label={<FormattedMessage id="ui-requests-mediated.form.instance.accordionLabel" />}
                        >
                          <InstanceInformation
                            request={request}
                            selectedInstance={selectedInstance}
                            isInstanceFromItem={isInstanceFromItem}
                            triggerValidation={this.triggerInstanceIdValidation}
                            findInstance={this.findInstance}
                            getInstanceValidationData={this.getInstanceValidationData}
                            submitting={submitting}
                            form={form}
                            values={values}
                            onSetSelectedInstance={onSetSelectedInstance}
                            isLoading={isItemOrInstanceLoading}
                            enterButtonClass={css.enterButton}
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
                            isItemFromItemsDialog={isItemFromItemsDialog}
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
                          />
                        </Accordion>
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
                      selectProxy={this.selectProxy}
                      handleCloseProxy={this.handleCloseProxy}
                      proxy={selectedProxy}
                      getUserValidationData={this.getUserValidationData}
                      triggerUserBarcodeValidation={this.triggerUserBarcodeValidation}
                      enterButtonClass={css.enterButton}
                    />
                  </Accordion>
                  <Accordion
                    id="requestInformationAccordion"
                    label={<FormattedMessage id="ui-requests-mediated.form.request.accordionLabel" />}
                  >
                    <RequestInformation
                      updateRequestPreferencesFields={this.updateRequestPreferencesFields}
                      request={request}
                      requestTypeOptions={requestTypeOptions}
                      isTitleLevelRequest={isTitleLevelRequest}
                      isRequestTypesReceived={isRequestTypesReceived}
                      isRequestTypeLoading={isRequestTypeLoading}
                      isSelectedInstance={Boolean(selectedInstance?.id)}
                      isSelectedItem={Boolean(selectedItem?.id)}
                      isSelectedUser={Boolean(selectedUser?.id)}
                      values={values}
                      form={form}
                      shouldValidate={shouldValidate}
                    />
                    {isFulfilmentPreferenceVisible &&
                      <FulfilmentPreference
                        isEditForm={isEditForm}
                        requestTypes={requestTypes}
                        deliverySelected={deliverySelected}
                        deliveryAddress={addressDetail}
                        onChangeAddress={this.onChangeAddress}
                        setDeliveryAddress={this.setDeliveryAddress}
                        deliveryLocations={deliveryLocations}
                        fulfillmentTypeOptions={fulfillmentTypeOptions}
                        defaultDeliveryAddressTypeId={defaultDeliveryAddressTypeId}
                        request={request}
                        form={form}
                        values={values}
                        shouldValidate={shouldValidate}
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
