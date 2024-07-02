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

import {
  REQUEST_FORM_FIELD_NAMES,
  RESOURCE_KEYS,
  ENTER_EVENT_KEY,
  BASE_SPINNER_PROPS,
} from '../../../../constants';
import ItemDetail from '../ItemDetail';
import {
  isFormEditing,
  memoizeValidation,
} from '../../../../utils';

class ItemInformation extends Component {
  static propTypes = {
    triggerValidation: PropTypes.func.isRequired,
    findItem: PropTypes.func.isRequired,
    getItemValidationData: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    request: PropTypes.object.isRequired,
    onSetSelectedItem: PropTypes.func.isRequired,
    itemRequestCount: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    isItemIdRequest: PropTypes.bool.isRequired,
    enterButtonClass: PropTypes.string.isRequired,
    selectedLoan: PropTypes.object,
    selectedItem: PropTypes.object,
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

  validate = memoizeValidation(async (barcode) => {
    const {
      isItemIdRequest,
      getItemValidationData,
    } = this.props;
    const { shouldValidate } = this.state;

    if (!barcode) {
      if (isItemIdRequest) {
        return undefined;
      } else {
        return <FormattedMessage id="ui-requests-mediated.form.errors.selectItem" />;
      }
    }

    if (barcode && shouldValidate) {
      this.setState({ shouldValidate: false });

      const item = await getItemValidationData(RESOURCE_KEYS.BARCODE, barcode);

      return !item
        ? <FormattedMessage id="ui-requests-mediated.form.errors.itemDoesNotExist" />
        : undefined;
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

    form.change(REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, barcode);
  };

  handleBlur = (input) => () => {
    const { triggerValidation } = this.props;
    const { validatedBarcode } = this.state;

    if (input.value && input.value !== validatedBarcode) {
      this.setState({
        shouldValidate: true,
        isItemBlurred: true,
        validatedBarcode: input.value,
      }, () => {
        input.onBlur();
        triggerValidation();
      });
    } else if (!input.value) {
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
        this.setState({ shouldValidate: true }, triggerValidation);
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
      itemRequestCount,
      enterButtonClass,
    } = this.props;
    const {
      isItemClicked,
      isItemBlurred,
    } = this.state;
    const isEditForm = isFormEditing(request);

    return (
      <Row>
        <Col xs={12}>
          {
            !isEditForm &&
            <Row>
              <Col xs={9}>
                <FormattedMessage id="ui-requests-mediated.form.item.inputPlaceholder">
                  {placeholder => {
                    const key = values.keyOfItemBarcodeField ?? 0;

                    return (
                      <Field
                        data-testid="itemBarcodeField"
                        key={key}
                        name={REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE}
                        validate={this.validate(REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, key)}
                        validateFields={[]}
                      >
                        {({ input, meta }) => {
                          const selectItemError = meta.touched && meta.error;
                          const itemDoesntExistError = (isItemClicked || isItemBlurred) && meta.error;
                          const error = meta.submitError || selectItemError || itemDoesntExistError || null;

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
                            />
                          );
                        }}
                      </Field>
                    );
                  }}
                </FormattedMessage>
              </Col>
              <Col xs={3}>
                <Button
                  id="clickable-select-item"
                  buttonStyle="primary noRadius"
                  buttonClass={enterButtonClass}
                  fullWidth
                  onClick={this.handleClick}
                  disabled={submitting}
                >
                  <FormattedMessage id="ui-requests-mediated.form.enterButton" />
                </Button>
              </Col>
            </Row>
          }
          {
            isLoading && <Icon {...BASE_SPINNER_PROPS} />
          }
          {
            selectedItem &&
              <ItemDetail
                request={request}
                item={selectedItem}
                loan={selectedLoan}
                requestCount={itemRequestCount}
              />
          }
        </Col>
      </Row>
    );
  }
}

export default ItemInformation;
