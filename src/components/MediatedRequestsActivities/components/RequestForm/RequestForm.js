import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { parse } from 'query-string';
import { isEqual } from 'lodash';

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
import {
  REQUEST_LEVEL_TYPES,
  RESOURCE_TYPES,
  RESOURCE_KEYS,
  REQUEST_FORM_FIELD_NAMES,
} from '../../../../constants';
import {
  handleKeyCommand,
  getPatronGroup,
  getTlrSettings,
  isSubmittingButtonDisabled,
} from '../../../../utils';

import css from './RequestForm.css';

class RequestForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    findResource: PropTypes.func.isRequired,
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
    } = props;
    const { loan } = (request || {});
    const { titleLevelRequestsFeatureEnabled } = getTlrSettings(settings?.items[0]?.value);

    this.state = {
      selectedLoan: loan,
      isItemOrInstanceLoading: false,
      isItemsDialogOpen: false,
      isItemIdRequest: this.isItemIdProvided(),
      titleLevelRequestsFeatureEnabled,
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
      form.change(REQUEST_FORM_FIELD_NAMES.CREATE_TLR, false);

      return;
    }

    if (itemId || itemBarcode) {
      form.change(REQUEST_FORM_FIELD_NAMES.CREATE_TLR, false);
    } else if (instanceId) {
      form.change(REQUEST_FORM_FIELD_NAMES.CREATE_TLR, true);
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

  findUser = (fieldName, value) => {
    const {
      form,
      findResource,
      onSetSelectedUser,
    } = this.props;

    return findResource(RESOURCE_TYPES.USER, value, fieldName)
      .then((result) => {
        if (result.totalRecords === 1) {
          const selectedUser = result.users[0];

          form.change(REQUEST_FORM_FIELD_NAMES.REQUESTER_ID, selectedUser.id);
          form.change(REQUEST_FORM_FIELD_NAMES.REQUESTER, selectedUser);
          onSetSelectedUser(selectedUser);

          if (fieldName === RESOURCE_KEYS.ID) {
            this.triggerUserBarcodeValidation();
          }

          return selectedUser;
        }

        return null;
      })
      .catch(() => {
        onSetSelectedUser(null);

        return null;
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

    return Promise.all(
      [
        findResource(RESOURCE_TYPES.LOAN, item.id),
        findResource(RESOURCE_TYPES.REQUESTS_FOR_ITEM, item.id)
      ],
    ).then((results) => {
      const selectedLoan = results[0]?.loans?.[0];
      const itemRequestCount = results[1]?.requests?.length;

      this.setState({
        itemRequestCount,
        selectedLoan,
      });

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
    const { isItemOrInstanceLoading } = this.state;
    const {
      findResource,
      form,
      onSetSelectedItem,
    } = this.props;

    this.setState({ isItemOrInstanceLoading: true });

    return findResource(RESOURCE_TYPES.ITEM, value, key)
      .then((result) => {
        this.setItemIdRequest(key, isBarcodeRequired);

        if (!result || result?.items?.length === 0) {
          return null;
        }

        const foundItem = result.items?.find(item => item[key] === value);

        form.change(REQUEST_FORM_FIELD_NAMES.ITEM_ID, foundItem.id);
        form.change(REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, foundItem.barcode);
        onSetSelectedItem(foundItem);
        this.setState({ isItemOrInstanceLoading: false });

        return foundItem;
      })
      .catch(() => {
        onSetSelectedItem(null);

        return null;
      })
      .then(item => this.findItemRelatedResources(item))
      .finally(() => {
        if (isItemOrInstanceLoading) {
          this.setState({ isItemOrInstanceLoading: false });
        }
      });
  }

  findInstanceRelatedResources = (instance) => {
    if (!instance?.id) {
      return null;
    }

    const { findResource } = this.props;

    return findResource(RESOURCE_TYPES.REQUESTS_FOR_INSTANCE, instance.id)
      .then((result) => {
        const instanceRequestCount = result.requests.filter(r => r.requestLevel === REQUEST_LEVEL_TYPES.TITLE).length || 0;

        this.setState({ instanceRequestCount });

        return instance;
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
    const { isItemOrInstanceLoading } = this.state;
    const {
      findResource,
      form,
      onSetSelectedInstance,
    } = this.props;

    this.setState({ isItemOrInstanceLoading: true });

    return findResource(RESOURCE_TYPES.INSTANCE, instanceId)
      .then((instance) => {
        if (!instance?.id) {
          return null;
        }

        form.change(REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, instance.id);
        form.change(REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, instance.hrid);
        onSetSelectedInstance(instance);
        this.setState({ isItemOrInstanceLoading: false });

        return instance;
      })
      .catch(() => {
        onSetSelectedInstance(null);

        return null;
      })
      .then(instance => {
        this.findInstanceRelatedResources(instance);

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

    form.change(REQUEST_FORM_FIELD_NAMES.KEY_OF_ITEM_BARCODE_FIELD, values.keyOfItemBarcodeField ? 0 : 1);
  };

  triggerUserBarcodeValidation = () => {
    const {
      form,
      values,
    } = this.props;

    form.change(REQUEST_FORM_FIELD_NAMES.KEY_OF_USER_BARCODE_FIELD, values.keyOfUserBarcodeField ? 0 : 1);
  };

  triggerInstanceIdValidation = () => {
    const {
      form,
      values,
    } = this.props;

    form.change(REQUEST_FORM_FIELD_NAMES.KEY_OF_INSTANCE_ID_FIELD, values.keyOfInstanceIdField ? 0 : 1);
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

    form.change(REQUEST_FORM_FIELD_NAMES.CREATE_TLR, isCreateTlr);
    form.change(REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, null);
    form.change(REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, null);
    form.change(REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, null);

    if (isCreateTlr) {
      if (selectedItem) {
        this.findInstance(selectedItem.instanceId);
      }

      onSetSelectedItem(undefined);
    } else if (selectedInstance) {
      this.setState({ isItemsDialogOpen: true });
    } else {
      onSetSelectedInstance(undefined);
    }
  };

  handleItemsDialogClose = () => {
    const { onSetSelectedInstance } = this.props;

    onSetSelectedInstance(undefined);
    this.setState({
      isItemsDialogOpen: false,
      isItemIdRequest: false,
    }, this.triggerItemBarcodeValidation);
  }

  handleInstanceItemClick = (event, item) => {
    const { onSetSelectedInstance } = this.props;
    let isBarcodeRequired = false;

    onSetSelectedInstance(undefined);
    this.setState({ isItemsDialogOpen: false });

    if (item?.barcode) {
      isBarcodeRequired = true;
      this.setState({ isItemIdRequest: false });
    }

    this.findItem(RESOURCE_KEYS.ID, item.id, isBarcodeRequired);
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

  render() {
    const {
      selectedLoan,
      itemRequestCount,
      instanceRequestCount,
      isUserLoading,
      isItemOrInstanceLoading,
      isItemsDialogOpen,
      isItemIdRequest,
      titleLevelRequestsFeatureEnabled,
    } = this.state;
    const {
      handleSubmit,
      request,
      form,
      patronGroups,
      submitting,
      selectedItem,
      selectedUser,
      selectedInstance,
      values,
      onCancel,
      pristine,
      onSetSelectedItem,
      onSetSelectedInstance,
      onSetSelectedUser,
    } = this.props;
    const { createTitleLevelRequest } = values;
    const patronGroup = getPatronGroup(selectedUser, patronGroups);
    const isSubmittingDisabled = isSubmittingButtonDisabled(pristine, submitting);
    const isTitleLevelRequest = createTitleLevelRequest || request?.requestLevel === REQUEST_LEVEL_TYPES.TITLE;
    const isTlrCheckboxDisabled = !titleLevelRequestsFeatureEnabled || isItemOrInstanceLoading;

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
            onSubmit={handleSubmit}
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
                  isSubmittingDisabled={isSubmittingDisabled}
                  footerClass={css.footerContent}
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
                          name={REQUEST_FORM_FIELD_NAMES.CREATE_TLR}
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
                            triggerValidation={this.triggerInstanceIdValidation}
                            findInstance={this.findInstance}
                            getInstanceValidationData={this.getInstanceValidationData}
                            submitting={submitting}
                            form={form}
                            values={values}
                            onSetSelectedInstance={onSetSelectedInstance}
                            isLoading={isItemOrInstanceLoading}
                            instanceRequestCount={instanceRequestCount}
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
                            isItemIdRequest={isItemIdRequest}
                            triggerValidation={this.triggerItemBarcodeValidation}
                            findItem={this.findItem}
                            getItemValidationData={this.getItemValidationData}
                            submitting={submitting}
                            onSetSelectedItem={onSetSelectedItem}
                            values={values}
                            itemRequestCount={itemRequestCount}
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
                      patronGroup={patronGroup}
                      isLoading={isUserLoading}
                      findUser={this.findUser}
                      getUserValidationData={this.getUserValidationData}
                      triggerUserBarcodeValidation={this.triggerUserBarcodeValidation}
                      enterButtonClass={css.enterButton}
                    />
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
