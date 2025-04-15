import { Component } from 'react';
import { isNull } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  Icon,
  Row,
  TextField,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import {
  MEDIATED_REQUEST_FORM_FIELD_NAMES,
  RESOURCE_KEYS,
  ENTER_EVENT_KEY,
  BASE_SPINNER_PROPS,
  DEFAULT_REQUEST_TYPE_VALUE,
  REQUEST_PROP_TYPES,
} from '../../../../constants';
import ItemDetail from '../ItemDetail';
import { memoizeValidation } from '../../../../utils';

import css from './ItemInformation.css';

class ItemInformation extends Component {
  static propTypes = {
    triggerValidation: PropTypes.func.isRequired,
    findItem: PropTypes.func.isRequired,
    getItemValidationData: PropTypes.func.isRequired,
    form: PropTypes.shape({
      change: PropTypes.func.isRequired,
    }).isRequired,
    values: PropTypes.shape({
      keyOfItemBarcodeField: PropTypes.string,
      item: PropTypes.shape({
        barcode: PropTypes.string,
      }),
    }).isRequired,
    onSetSelectedItem: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    isItemIdRequest: PropTypes.bool.isRequired,
    enterButtonClass: PropTypes.string.isRequired,
    isItemPreselected: PropTypes.bool.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    request: REQUEST_PROP_TYPES,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    selectedLoan: PropTypes.shape({
      dueDate: PropTypes.string,
    }),
    selectedItem: PropTypes.shape({
      id: PropTypes.string,
      barcode: PropTypes.string,
      instanceId: PropTypes.string,
      holdingsRecordId: PropTypes.string,
      location: PropTypes.shape({
        name: PropTypes.string,
      }),
      status: PropTypes.shape({
        name: PropTypes.string,
      }),
      contributors: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
      })),
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      shouldValidate: false,
      isItemClicked: false,
      isItemBlurred: false,
      validatedBarcode: null,
    };
  }

  componentDidUpdate(prevProps) {
    const {
      isItemPreselected,
      selectedItem,
      isEditMode,
      triggerValidation,
      request,
    } = this.props;
    const isNewPreselectedValue = isItemPreselected && isItemPreselected !== prevProps.isItemPreselected;

    if (selectedItem && isNewPreselectedValue) {
      this.setState({ validatedBarcode: selectedItem.barcode });
    }

    if (isEditMode && !selectedItem && isNewPreselectedValue) {
      this.setState({
        shouldValidate: true,
        validatedBarcode: request?.item?.barcode,
      }, triggerValidation);
    }
  }

  validate = memoizeValidation(async (barcode) => {
    const {
      isItemIdRequest,
      getItemValidationData,
    } = this.props;
    const { shouldValidate } = this.state;

    if (!barcode) {
      return isItemIdRequest
        ? undefined
        : <FormattedMessage id="ui-requests-mediated.form.errors.selectItem" />;
    }

    if (barcode && shouldValidate) {
      this.setState({ shouldValidate: false });

      const item = await getItemValidationData(RESOURCE_KEYS.BARCODE, barcode);

      return item
        ? undefined
        : <FormattedMessage id="ui-requests-mediated.form.errors.itemDoesNotExist" />;
    }

    return undefined;
  });

  handleChange = (event) => {
    const { form } = this.props;
    const {
      isItemClicked,
      isItemBlurred,
      validatedBarcode,
    } = this.state;
    const barcode = event.target.value;

    if (isItemClicked || isItemBlurred) {
      this.setState({
        isItemClicked: false,
        isItemBlurred: false,
      });
    }

    if (!isNull(validatedBarcode)) {
      this.setState({ validatedBarcode: null });
    }

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, barcode);
  };

  resetItem = () => {
    const {
      form,
      onSetSelectedItem,
    } = this.props;

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);
    onSetSelectedItem(null);
  };

  handleBlur = (input) => () => {
    const { validatedBarcode } = this.state;
    const {
      triggerValidation,
      isItemIdRequest,
    } = this.props;
    const isNotValidatedBarcode = input.value !== validatedBarcode;

    if (input.value && isNotValidatedBarcode) {
      this.resetItem();
      this.setState({
        shouldValidate: true,
        isItemBlurred: true,
        validatedBarcode: input.value,
      }, () => {
        input.onBlur();
        triggerValidation();
      });
    } else if (!input.value && !(isNotValidatedBarcode && isItemIdRequest)) {
      this.resetItem();
      input.onBlur();
    }
  }

  onKeyDown = (e) => {
    if (e.key === ENTER_EVENT_KEY && !e.shiftKey) {
      e.preventDefault();
      this.handleClick(e.key);
    }
  };

  handleClick = (eventKey) => {
    const {
      onSetSelectedItem,
      findItem,
      triggerValidation,
      values,
    } = this.props;
    const barcode = values.item?.barcode;

    if (barcode) {
      onSetSelectedItem(null);
      this.setState({ isItemClicked: true });

      findItem(RESOURCE_KEYS.BARCODE, barcode);

      if (eventKey === ENTER_EVENT_KEY) {
        this.setState({
          shouldValidate: true,
          validatedBarcode: barcode,
        }, triggerValidation);
      }
    }
  }

  render() {
    const {
      values,
      submitting,
      isLoading,
      selectedItem,
      request,
      selectedLoan,
      enterButtonClass,
      stripes,
      isEditMode,
    } = this.props;
    const {
      isItemClicked,
      isItemBlurred,
    } = this.state;
    const isEditPermission = stripes.hasPerm('ui-requests-mediated.requests-mediated.view-create-edit.execute');
    const isEnterButtonDisabled = submitting || !isEditPermission;

    return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col
              xs={12}
              className={css.fieldWrapper}
            >
              <FormattedMessage id="ui-requests-mediated.form.item.inputPlaceholder">
                {placeholder => {
                  const key = values.keyOfItemBarcodeField ?? 0;

                  return (
                    <Field
                      data-testid="itemBarcodeField"
                      key={key}
                      name={MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE}
                      validate={this.validate(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, key)}
                      validateFields={[]}
                    >
                      {({ input, meta }) => {
                        const selectItemError = meta.touched && meta.error;
                        const itemDoesntExistError = (isItemClicked || isItemBlurred || (isEditMode && !selectedItem)) && meta.error;
                        const error = selectItemError || itemDoesntExistError || null;

                        return (
                          <TextField
                            {...input}
                            required
                            placeholder={placeholder}
                            label={<FormattedMessage id="ui-requests-mediated.form.item.inputLabel" />}
                            error={error}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur(input)}
                            onKeyDown={this.onKeyDown}
                            disabled={!isEditPermission}
                            className={css.itemBarcodeField}
                          />
                        );
                      }}
                    </Field>
                  );
                }}
              </FormattedMessage>
              <Button
                id="selectItemButton"
                buttonStyle="default"
                buttonClass={enterButtonClass}
                onClick={this.handleClick}
                disabled={isEnterButtonDisabled}
              >
                <FormattedMessage id="ui-requests-mediated.form.enterButton" />
              </Button>
            </Col>
          </Row>
          {
            isLoading && <Icon {...BASE_SPINNER_PROPS} />
          }
          {
            selectedItem &&
              <ItemDetail
                request={request}
                item={selectedItem}
                loan={selectedLoan}
              />
          }
        </Col>
      </Row>
    );
  }
}

export default stripesConnect(ItemInformation);
