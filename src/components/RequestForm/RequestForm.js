import React, {
  useRef,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { parse } from 'query-string';
import {
  isEqual,
  isEmpty,
  defer,
  isNil,
} from 'lodash';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  Pane,
  PaneFooter,
  PaneHeaderIconButton,
  PaneMenu,
  Paneset,
  Row,
  Checkbox,
  AccordionStatus,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import RequestFormShortcutsWrapper from '../../components/RequestFormShortcutsWrapper';
// import CancelRequestDialog from './CancelRequestDialog';
// import PatronBlockModal from './PatronBlockModal';
import {
  ItemInformation,
  InstanceInformation,
  RequesterInformation,
  ItemsDialog,
} from '../';
import {
  ICON_TYPES,
  REQUEST_LEVEL_TYPES,
  RESOURCE_TYPES,
  RESOURCE_KEYS,
  REQUEST_FORM_FIELD_NAMES,
  DEFAULT_REQUEST_TYPE_VALUE,
  REQUEST_LAYERS,
  REQUEST_OPERATIONS,
  ID_TYPE_MAP,
} from '../../constants';
import {
  handleKeyCommand,
  getPatronGroup,
  // parseErrorMessage,
  getProxy,
  isSubmittingButtonDisabled,
  isFormEditing,
  resetFieldState,
  getResourceTypeId,
  isTLR,
  getRequestInformation,
} from '../../utils';

import css from './RequestForm.css';

const RequestForm = ({
   parentResources: resources,
   parentMutator: mutator,
   request,
   initialValues,
   location,
   form,
   toggleModal,
   selectedItem,
   selectedInstance,
   values,
   selectedUser,
   onSetSelectedUser,
   findResource,
   onChangePatron,
   onGetPatronManualBlocks,
   onGetAutomatedPatronBlocks,
   onSetIsPatronBlocksOverridden,
   onSetBlocked,
   onCancelRequest,
   onSetInstanceId,
   onSetSelectedItem,
   onSetSelectedInstance,
   history,
   onCancel,
   handleSubmit,
   patronGroups,
   submitting,
   intl: {
     formatMessage,
   },
   errorMessage,
   isPatronBlocksOverridden,
   instanceId,
   blocked,
   pristine,
   stripes,
}) => {
  const { loan } = (request || {});
  const { titleLevelRequestsFeatureEnabled } = resources?.configs?.records[0]?.value || {};
  const accordionStatusRef = useRef();
  const [proxy, setProxy] = useState({});
  const [isTLREnabled, setIsTLREnabled] = useState(titleLevelRequestsFeatureEnabled);
  const [selectedLoan, setSelectedLoan] = useState(loan);
  const [requestTypes, setRequestTypes] = useState({});
  const [itemRequestCount, setItemRequestCount] = useState(null);
  const [isRequestTypesReceived, setIsRequestTypesReceived] = useState(false);
  const [isAwaitingForProxySelection, setIsAwaitingForProxySelection] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isRequestTypeLoading, setIsRequestTypeLoading] = useState(false);
  const [isItemOrInstanceLoading, setIsItemOrInstanceLoading] = useState(false);
  const [isItemIdRequest, setIsItemIdRequest] = useState(Boolean(parse(location.search)?.itemId));
  const [isCancellingRequest, setIsCancellingRequest] = useState(false);
  const [isItemsDialogOpen, setIsItemsDialogOpen] = useState(false);
  const [isRequestTypesForDuplicate, setIsRequestTypesForDuplicate] = useState(false);
  const [isRequestTypesForEditing, setIsRequestTypesForEditing] = useState(false);
  const [instanceRequestCount, setInstanceRequestCount] = useState(null);

  // const connectedCancelRequestDialog = props.stripes.connect(CancelRequestDialog);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const itemBarcode = query.get('itemBarcode');
    const itemId = query.get('itemId');
    const instanceId = query.get('instanceId');
    const userBarcode = query.get('userBarcode');
    const userId = query.get('userId');

    if (userBarcode) {
      findUser(RESOURCE_KEYS.BARCODE, userBarcode);
    } else if (userId) {
      findUser(RESOURCE_KEYS.ID, userId);
    }

    if (itemBarcode) {
      findItem(RESOURCE_KEYS.BARCODE, itemBarcode);
    }

    if (itemId) {
      findItem(RESOURCE_KEYS.ID, itemId);
    }

    if (instanceId && !itemBarcode && !itemId) {
      findInstance(instanceId);
    }

    setTlrCheckboxInitialState();
  }, []);

  useEffect(() => {
    // todo: requires additional investigation for changing ComponentDidUpdate
  }, []);

  const getTlrSettings = () => {
    return resources?.configs?.records[0]?.value || {};
  }

  const setTlrCheckboxInitialState = () => {
    const query = new URLSearchParams(location.search);

    if (isTLREnabled === false) {
      form.change(REQUEST_FORM_FIELD_NAMES.CREATE_TLR, false);

      return;
    }

    if (query.get('itemId') || query.get('itemBarcode')) {
      form.change(REQUEST_FORM_FIELD_NAMES.CREATE_TLR, false);
    } else if (query.get('instanceId')) {
      form.change(REQUEST_FORM_FIELD_NAMES.CREATE_TLR, true);
    }
  }

  const onClose = () => {
    toggleModal();
  }

  const getAvailableRequestTypes = (user) => {
    const {
      selectedResource,
      isTitleLevelRequest,
    } = getRequestInformation(values, selectedInstance, selectedItem, request);

    if (selectedResource?.id && user?.id) {
      const resourceTypeId = getResourceTypeId(isTitleLevelRequest);

      findRequestTypes(selectedResource.id, user.id, resourceTypeId, selectedResource.tenantId);
    }
  }

  // Executed when a user is selected from the proxy dialog,
  // regardless of whether the selection is "self" or an actual proxy
  const onSelectProxy = (proxy) => {
    if (selectedUser.id === proxy.id) {
      onSetSelectedUser(selectedUser);
      setProxy(selectedUser);
      form.change(REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, selectedUser.id);
    } else {
      onSetSelectedUser(selectedUser);
      setProxy(proxy);
      setRequestTypes({});
      setIsRequestTypesReceived(false);
      form.change(REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, proxy.id);
      form.change(REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, selectedUser.id);
      getAvailableRequestTypes(proxy);
    }

    setIsAwaitingForProxySelection(false);
  }

  const hasProxies = async (user) => {
    if (!user) {
      setIsAwaitingForProxySelection(false);

      return null;
    }

    const query = `query=(proxyUserId==${user.id})`;

    mutator.proxy.reset();

    const userProxies = await mutator.proxy.GET({ params: { query } });

    if (userProxies.length) {
      setIsAwaitingForProxySelection(true);
    } else {
      setIsAwaitingForProxySelection(false);
    }

    return user;
  }

  const shouldSetBlocked = (blocks, selectedUser) => {
    return blocks.length && blocks[0].userId === selectedUser.id;
  }

  const findUser = (fieldName, value, isValidation = false) => {
    setIsUserLoading(true);

    if (isValidation) {
      return findResource(RESOURCE_TYPES.USER, value, fieldName)
        .then((result) => {
          return result.totalRecords;
        })
        .finally(() => {
          setIsUserLoading(false);
        });
    } else {
      setProxy(null);
      setRequestTypes({});
      setIsRequestTypesReceived(false);

      form.change(REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, undefined);
      form.change(REQUEST_FORM_FIELD_NAMES.DELIVERY_ADDRESS_TYPE_ID, undefined);
      form.change(REQUEST_FORM_FIELD_NAMES.PROXY_USER_ID, undefined);

      return findResource(RESOURCE_TYPES.USER, value, fieldName)
        .then((result) => {
          setIsAwaitingForProxySelection(true);

          if (result.totalRecords === 1) {
            const blocks = onGetPatronManualBlocks(resources);
            const automatedPatronBlocks = onGetAutomatedPatronBlocks(resources);
            const isAutomatedPatronBlocksRequestInPendingState = resources.automatedPatronBlocks.isPending;
            const selectedUser = result.users[0];
            onChangePatron(selectedUser);
            form.change(REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, selectedUser.id);
            form.change(REQUEST_FORM_FIELD_NAMES.REQUESTER, selectedUser);
            onSetSelectedUser(selectedUser);

            if (fieldName === RESOURCE_KEYS.ID) {
              triggerUserBarcodeValidation();
            }

            if (shouldSetBlocked(blocks, selectedUser) || (!isEmpty(automatedPatronBlocks) && !isAutomatedPatronBlocksRequestInPendingState)) {
              onSetBlocked(true);
              onSetIsPatronBlocksOverridden(false);
            }

            return selectedUser;
          }

          return null;
        })
        .then(user => {
          getAvailableRequestTypes(user);

          return user;
        })
        .then(user => hasProxies(user))
        .finally(() => {
          setIsUserLoading(false);
        });
    }
  }

  const findRequestTypes = (resourceId, requesterId, resourceType, tenantId) => {
    const isEditForm = isFormEditing(request);
    let requestParams;

    if (isEditForm) {
      requestParams = {
        operation: REQUEST_OPERATIONS.REPLACE,
        requestId: request.id,
      };
    } else {
      requestParams = {
        operation: REQUEST_OPERATIONS.CREATE,
        [resourceType]: resourceId,
        requesterId,
        tenantId,
      };
      form.change(REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);
    }

    setIsRequestTypeLoading(true);

    findResource(RESOURCE_TYPES.REQUEST_TYPES, requestParams)
      .then(requestTypes => {
        if (!isEmpty(requestTypes)) {
          setIsRequestTypesReceived(true);
          setRequestTypes(requestTypes);

          triggerRequestTypeValidation(); // todo: should be done after state changed
        } else {
          setIsRequestTypesReceived(true);

          triggerRequestTypeValidation(); // todo: should be done after state changed
        }
      })
      .finally(() => {
        setIsRequestTypeLoading(false);
      });
  }

  const findItemRelatedResources = (item) => {
    if (!item){
      return null;
    }

    return Promise.all(
      [
        findResource('loan', item.id),
        findResource('requestsForItem', item.id),
        findResource(RESOURCE_TYPES.HOLDING, item.holdingsRecordId),
      ],
    ).then((results) => {
      const selectedLoan = results[0]?.loans?.[0];
      const itemRequestCount = results[1]?.requests?.length;
      const holdingsRecord = results[2]?.holdingsRecords?.[0];

      onSetInstanceId(holdingsRecord?.instanceId);
      setItemRequestCount(itemRequestCount);
      setSelectedLoan(selectedLoan);

      return item;
    });
  }

  const setItemIdRequest = (key, isBarcodeRequired) => {
    if (key === RESOURCE_KEYS.ID && !isBarcodeRequired) {
      setIsItemIdRequest(true);
    } else if (key === RESOURCE_KEYS.BARCODE && isItemIdRequest) {
      setIsItemIdRequest(false);
    }
  };

  const findItem = (key, value, isValidation = false, isBarcodeRequired = false) => {
    setIsItemOrInstanceLoading(true);

    if (isValidation) {
      return findResource(RESOURCE_TYPES.ITEM, value, key)
        .then((result) => {
          return result?.items?.length;
        })
        .finally(() => {
          setIsItemOrInstanceLoading(false);
        });
    } else {
      setRequestTypes({});
      setIsRequestTypesReceived(false);

      return findResource(RESOURCE_TYPES.ITEM, value, key)
        .then((result) => {
          setItemIdRequest(key, isBarcodeRequired);

          if (!result || result?.items?.length === 0) {
            setIsItemOrInstanceLoading(false);

            return null;
          }

          const foundItem = result.items?.find(item => item[key] === value);

          form.change(REQUEST_FORM_FIELD_NAMES.ITEM_ID, foundItem.id);
          form.change(REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, foundItem.barcode);
          resetFieldState(form, REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE);

          // Setting state here is redundant with what follows, but it lets us
          // display the matched item as quickly as possible, without waiting for
          // the slow loan and request lookups
          onSetSelectedItem(foundItem);
          setIsItemOrInstanceLoading(false);

          return foundItem;
        })
        .then(item => {
          if (item && selectedUser?.id) {
            findRequestTypes(item.id, selectedUser.id, ID_TYPE_MAP.ITEM_ID, item.tenantId);
          }

          return item;
        })
        .then(item => findItemRelatedResources(item));
    }
  }

  const findInstanceRelatedResources = (instance) => {
    if (!instance?.id) {
      return null;
    }

    return findResource('requestsForInstance', instance.id)
      .then((result) => {
        const instanceRequestCount = result.requests.filter(r => r.requestLevel === REQUEST_LEVEL_TYPES.TITLE).length || 0;

        setInstanceRequestCount(instanceRequestCount);

        return instance;
      });
  }

  const findInstance = async (instanceId, holdingsRecordId, isValidation = false) => {
    setIsItemOrInstanceLoading(true);

    const resultInstanceId = isNil(instanceId)
      ? await findResource(RESOURCE_TYPES.HOLDING, holdingsRecordId).then((holding) => holding.holdingsRecords[0].instanceId)
      : instanceId;

    if (isValidation) {
      return findResource(RESOURCE_TYPES.INSTANCE, resultInstanceId)
        .then((result) => {
          return Boolean(result?.id);
        })
        .finally(() => {
          setIsItemOrInstanceLoading(false);
        });
    } else {
      setRequestTypes({});
      setIsRequestTypesReceived(false);

      return findResource(RESOURCE_TYPES.INSTANCE, resultInstanceId)
        .then((instance) => {
          if (!instance?.id) {
            setIsItemOrInstanceLoading(false);

            return null;
          }

          form.change(REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, instance.id);
          form.change(REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, instance.hrid);
          resetFieldState(form, REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE);

          onSetSelectedInstance(instance);
          setIsItemOrInstanceLoading(false);

          return instance;
        })
        .then(instance => {
          if (instance && selectedUser?.id) {
            findRequestTypes(instance.id, selectedUser.id, ID_TYPE_MAP.INSTANCE_ID, instance.tenantId);
          }

          return instance;
        })
        .then(instance => {
          findInstanceRelatedResources(instance);

          return instance;
        });
    }
  }

  const triggerItemBarcodeValidation = () => {
    form.change('keyOfItemBarcodeField', values.keyOfItemBarcodeField ? 0 : 1);
  };

  const triggerUserBarcodeValidation = () => {
    form.change('keyOfUserBarcodeField', values.keyOfUserBarcodeField ? 0 : 1);
  };

  const triggerInstanceIdValidation = () => {
    form.change('keyOfInstanceIdField', values.keyOfInstanceIdField ? 0 : 1);
  };

  const triggerRequestTypeValidation = () => {
    form.change('keyOfRequestTypeField', values.keyOfRequestTypeField ? 0 : 1);
  };

  const cancelRequest = (cancellationInfo) => {
    setIsCancellingRequest(false);
    onCancelRequest(cancellationInfo);
  }

  const onCloseBlockedModal = () => {
    onSetBlocked(false);
  }

  const onViewUserPath = (selectedUser, patronGroup) => {
    // reinitialize form (mark it as pristine)
    form.reset();
    // wait for the form to be reinitialized
    defer(() => {
      setIsCancellingRequest(false);
      const viewUserPath = `/users/view/${(selectedUser || {}).id}?filters=pg.${patronGroup.group}`;
      history.push(viewUserPath);
    });
  }

  const renderAddRequestFirstMenu = () => (
    <PaneMenu>
      <FormattedMessage id="ui-requests.actions.closeNewRequest">
        {title => (
          <PaneHeaderIconButton
            onClick={onCancel}
            ariaLabel={title}
            icon={ICON_TYPES.TIMES}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );

  const overridePatronBlocks = () => {
    onSetIsPatronBlocksOverridden(true);
  };

  const handleTlrCheckboxChange = (event) => {
    const isCreateTlr = event.target.checked;

    form.change(REQUEST_FORM_FIELD_NAMES.CREATE_TLR, isCreateTlr);
    form.change(REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, null);
    form.change(REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, null);
    form.change(REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, null);

    if (isCreateTlr) {
      onSetSelectedItem(undefined);
      setRequestTypes({});
      setIsRequestTypesReceived(false);

      if (selectedItem) {
        findInstance(null, selectedItem.holdingsRecordId);
      }
    } else if (selectedInstance) {
      form.change(REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);
      resetFieldState(form, REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE);
      setIsItemsDialogOpen(true);
    } else {
      onSetSelectedInstance(undefined);
      setRequestTypes({});
      setIsRequestTypesReceived(false);
    }
  };

  const handleItemsDialogClose = () => {
    onSetSelectedInstance(undefined);
    setIsItemsDialogOpen(false);
    setRequestTypes({});
    setIsRequestTypesReceived(false);
    setIsItemIdRequest(false);

    triggerItemBarcodeValidation(); //todo: should be done after state change
  }

  const handleInstanceItemClick = (event, item) => {
    let isBarcodeRequired = false;

    onSetSelectedInstance(undefined);
    setIsItemsDialogOpen(false);
    setRequestTypes({});

    if (item?.barcode) {
      isBarcodeRequired = true;
      setIsItemIdRequest(false);
    }

    findItem(RESOURCE_KEYS.ID, item.id, false, isBarcodeRequired);
  }

  const handleCloseProxy = () => {
    onSetSelectedUser(null);
    setProxy(null);
  };

  const handleCancelAndClose = () => {
    const keepEditBtn = document.getElementById('clickable-cancel-editing-confirmation-confirm');
    if (isItemsDialogOpen){
      handleKeyCommand(handleItemsDialogClose);
    } else if (errorMessage) {
      onClose();
    } else if (keepEditBtn) {
      keepEditBtn.click();
    } else {
      onCancel();
    }
  };

  const {
    createTitleLevelRequest,
  } = values;
  // const patronBlocks = onGetPatronManualBlocks(resources);
  // const automatedPatronBlocks = onGetAutomatedPatronBlocks(resources);
  const isEditForm = isFormEditing(request);
  const patronGroup = getPatronGroup(selectedUser, patronGroups);
  const selectedProxy = getProxy(request, proxy);
  const isSubmittingDisabled = isSubmittingButtonDisabled(pristine, submitting);
  const isTitleLevelRequest = createTitleLevelRequest || request?.requestLevel === REQUEST_LEVEL_TYPES.TITLE;
  // const getPatronBlockModalOpenStatus = () => {
  //   if (isAwaitingForProxySelection) {
  //     return false;
  //   }
  //
  //   const isBlockedAndOverriden = blocked && !isPatronBlocksOverridden;
  //
  //   return proxy?.id
  //     ? isBlockedAndOverriden && (proxy.id === selectedUser?.id)
  //     : isBlockedAndOverriden;
  // };

  return (
    <Paneset isRoot>
      <RequestFormShortcutsWrapper
        onSubmit={handleSubmit}
        onCancel={handleCancelAndClose}
        accordionStatusRef={accordionStatusRef}
        isSubmittingDisabled={isSubmittingDisabled}
      >
        <form
          id="form-requests"
          noValidate
          className={css.requestForm}
          onSubmit={handleSubmit}
        >
          <Pane
            id="request"
            defaultWidth="100%"
            height="100%"
            firstMenu={renderAddRequestFirstMenu()}
            paneTitle={
              isEditForm
                ? <FormattedMessage id="ui-requests.actions.editRequest" />
                : <FormattedMessage id="ui-requests.actions.newRequest" />
            }
            footer={
              <PaneFooter>
                <div className={css.footerContent}>
                  <Button
                    id="clickable-cancel-request-changes"
                    marginBottom0
                    buttonStyle="default mega"
                    onClick={onCancel}
                  >
                    <FormattedMessage id="ui-requests.common.cancel" />
                  </Button>
                  <Button
                    id="clickable-save-request"
                    type="submit"
                    marginBottom0
                    buttonStyle="primary mega"
                    disabled={isSubmittingDisabled}
                  >
                    <FormattedMessage id="stripes-components.saveAndClose" />
                  </Button>
                </div>
              </PaneFooter>
            }
          >
            {/*{*/}
            {/*  errorMessage &&*/}
            {/*  <ErrorModal*/}
            {/*    onClose={onClose}*/}
            {/*    label={<FormattedMessage id="ui-requests.requestNotAllowed" />}*/}
            {/*    errorMessage={parseErrorMessage(errorMessage)}*/}
            {/*  />*/}
            {/*}*/}
            {
              isTLREnabled && !isEditForm &&
              <div
                className={css.tlrCheckbox}
              >
                <Row>
                  <Col xs={12}>
                    <Field
                      data-testid="tlrCheckbox"
                      name={REQUEST_FORM_FIELD_NAMES.CREATE_TLR}
                      type="checkbox"
                      label={formatMessage({ id: 'ui-requests.requests.createTitleLevelRequest' })}
                      component={Checkbox}
                      checked={isTitleLevelRequest}
                      disabled={!isTLREnabled || isItemOrInstanceLoading}
                      onChange={handleTlrCheckboxChange}
                    />
                  </Col>
                </Row>
              </div>
            }
            <AccordionStatus ref={accordionStatusRef}>
              <AccordionSet>
                {
                  isTitleLevelRequest
                    ? (
                      <Accordion
                        id="new-instance-info"
                        label={<FormattedMessage id="ui-requests.instance.information" />}
                      >
                        <div
                          data-testid="instanceInfoSection"
                          id="section-instance-info"
                        >
                          {/*<InstanceInformation*/}
                          {/*  request={request}*/}
                          {/*  selectedInstance={selectedInstance}*/}
                          {/*  triggerValidation={triggerInstanceIdValidation}*/}
                          {/*  findInstance={findInstance}*/}
                          {/*  submitting={submitting}*/}
                          {/*  form={form}*/}
                          {/*  values={values}*/}
                          {/*  onSetSelectedInstance={onSetSelectedInstance}*/}
                          {/*  isLoading={isItemOrInstanceLoading}*/}
                          {/*  instanceRequestCount={instanceRequestCount}*/}
                          {/*  instanceId={instanceId}*/}
                          {/*/>*/}
                        </div>
                      </Accordion>
                    )
                    : (
                      <Accordion
                        id="new-item-info"
                        label={<FormattedMessage id="ui-requests.item.information" />}
                      >
                        <div id="section-item-info">
                          <ItemInformation
                            request={request}
                            form={form}
                            selectedItem={selectedItem}
                            isItemIdRequest={isItemIdRequest}
                            triggerValidation={triggerItemBarcodeValidation}
                            findItem={findItem}
                            submitting={submitting}
                            onSetSelectedItem={onSetSelectedItem}
                            values={values}
                            itemRequestCount={itemRequestCount}
                            instanceId={instanceId}
                            selectedLoan={selectedLoan}
                            isLoading={isItemOrInstanceLoading}
                          />
                        </div>
                      </Accordion>
                    )
                }
                <Accordion
                  id="new-requester-info"
                  label={<FormattedMessage id="ui-requests.requester.information" />}
                >
                  <div id="section-requester-info">
                    <RequesterInformation
                      values={values}
                      form={form}
                      onSetSelectedUser={onSetSelectedUser}
                      submitting={submitting}
                      onSetIsPatronBlocksOverridden={onSetIsPatronBlocksOverridden}
                      onSetBlocked={onSetBlocked}
                      stripes={stripes}
                      selectedUser={selectedUser}
                      patronGroup={patronGroup}
                      selectedProxy={selectedProxy}
                      isLoading={isUserLoading}
                      request={request}
                      optionLists={{}}
                      onSelectProxy={onSelectProxy}
                      handleCloseProxy={handleCloseProxy}
                      findUser={findUser}
                      triggerUserBarcodeValidation={triggerUserBarcodeValidation}
                    />
                  </div>
                </Accordion>
              </AccordionSet>
            </AccordionStatus>
            {/*<connectedCancelRequestDialog*/}
            {/*  open={isCancellingRequest}*/}
            {/*  onCancelRequest={cancelRequest}*/}
            {/*  onClose={() => setIsCancellingRequest(false)}*/}
            {/*  request={request}*/}
            {/*  stripes={stripes}*/}
            {/*/>*/}
            {/*<PatronBlockModal*/}
            {/*  open={getPatronBlockModalOpenStatus()}*/}
            {/*  onClose={onCloseBlockedModal}*/}
            {/*  onOverride={overridePatronBlocks}*/}
            {/*  viewUserPath={() => onViewUserPath(selectedUser, patronGroup)}*/}
            {/*  patronBlocks={patronBlocks || []}*/}
            {/*  automatedPatronBlocks={automatedPatronBlocks}*/}
            {/*/>*/}
            {/*<ItemsDialog*/}
            {/*  onClose={handleItemsDialogClose}*/}
            {/*  onRowClick={handleInstanceItemClick}*/}
            {/*  instanceId={selectedInstance?.id}*/}
            {/*  title={selectedInstance?.title}*/}
            {/*  open={isItemsDialogOpen}*/}
            {/*/>*/}
          </Pane>
        </form>
      </RequestFormShortcutsWrapper>
    </Paneset>
  );
};

RequestForm.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  errorMessage: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  findResource: PropTypes.func.isRequired,
  request: PropTypes.object,
  metadataDisplay: PropTypes.func,
  initialValues: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onCancelRequest: PropTypes.func,
  pristine: PropTypes.bool,
  resources: PropTypes.shape({
    query: PropTypes.object,
  }),
  submitting: PropTypes.bool,
  toggleModal: PropTypes.func,
  optionLists: PropTypes.shape({
    addressTypes: PropTypes.arrayOf(PropTypes.object),
    fulfillmentTypes: PropTypes.arrayOf(PropTypes.object),
    servicePoints: PropTypes.arrayOf(PropTypes.object),
  }),
  patronGroups: PropTypes.arrayOf(PropTypes.object),
  parentResources: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  intl: PropTypes.object,
  onChangePatron: PropTypes.func,
  query: PropTypes.object,
  selectedItem: PropTypes.object,
  selectedInstance: PropTypes.object,
  selectedUser: PropTypes.object,
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  blocked: PropTypes.bool.isRequired,
  instanceId: PropTypes.string.isRequired,
  isPatronBlocksOverridden: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func,
  parentMutator: PropTypes.shape({
    proxy: PropTypes.shape({
      reset: PropTypes.func.isRequired,
      GET: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  isTlrEnabledOnEditPage: PropTypes.bool,
  onGetAutomatedPatronBlocks: PropTypes.func.isRequired,
  onGetPatronManualBlocks: PropTypes.func.isRequired,
  onSetSelectedItem: PropTypes.func.isRequired,
  onSetSelectedUser: PropTypes.func.isRequired,
  onSetSelectedInstance: PropTypes.func.isRequired,
  onSetBlocked: PropTypes.func.isRequired,
  onSetIsPatronBlocksOverridden: PropTypes.func.isRequired,
  onSetInstanceId: PropTypes.func.isRequired,
};

RequestForm.defaultProps = {
  request: null,
  metadataDisplay: () => { },
  optionLists: {},
  pristine: true,
  submitting: false,
  isTlrEnabledOnEditPage: false,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    values: true,
  },
})(RequestForm);
