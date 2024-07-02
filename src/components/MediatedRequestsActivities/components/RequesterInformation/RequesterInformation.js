import { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { isNull } from 'lodash';

import {
  Button,
  Col,
  Icon,
  Row,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import UserDetail from '../UserDetail';
import {
  isFormEditing,
  memoizeValidation,
} from '../../../../utils';
import {
  REQUEST_FORM_FIELD_NAMES,
  RESOURCE_KEYS,
  ENTER_EVENT_KEY,
  BASE_SPINNER_PROPS,
} from '../../../../constants';

export const VISIBLE_COLUMNS = ['active', 'name', 'patronGroup', 'username', 'barcode'];
export const COLUMN_MAPPING = {
  name: <FormattedMessage id="ui-requests-mediated.form.requesterLookup.name" />,
  patronGroup: <FormattedMessage id="ui-requests-mediated.form.requesterLookup.patronGroup" />,
  username: <FormattedMessage id="ui-requests-mediated.form.requesterLookup.username" />,
  barcode: <FormattedMessage id="ui-requests-mediated.form.requesterLookup.barcode" />,
};

class RequesterInformation extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    onSetSelectedUser: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    findUser: PropTypes.func.isRequired,
    getUserValidationData: PropTypes.func.isRequired,
    triggerUserBarcodeValidation: PropTypes.func.isRequired,
    enterButtonClass: PropTypes.string.isRequired,
    selectedUser: PropTypes.object,
    isLoading: PropTypes.bool,
    request: PropTypes.object,
    patronGroup: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      shouldValidate: false,
      isUserClicked: false,
      isUserBlurred: false,
      validatedBarcode: null,
    };
  }

  validate = memoizeValidation(async (barcode) => {
    const {
      selectedUser,
      getUserValidationData,
    } = this.props;
    const { shouldValidate } = this.state;

    if (selectedUser?.id && !barcode) {
      return undefined;
    }

    if (!barcode) {
      return <FormattedMessage id="ui-requests-mediated.form.errors.selectUser" />;
    }

    if (barcode && shouldValidate) {
      this.setState({ shouldValidate: false });

      const user = await getUserValidationData(RESOURCE_KEYS.BARCODE, barcode);

      return !user
        ? <FormattedMessage id="ui-requests-mediated.form.errors.userDoesNotExist" />
        : undefined;
    }

    return undefined;
  });

  handleClick = (eventKey) => {
    const {
      values,
      onSetSelectedUser,
      findUser,
      triggerUserBarcodeValidation,
    } = this.props;
    const barcode = values.requester?.barcode;

    if (barcode) {
      onSetSelectedUser(null);
      this.setState({ isUserClicked: true });
      findUser(RESOURCE_KEYS.BARCODE, barcode);

      if (eventKey === ENTER_EVENT_KEY) {
        this.setState({ shouldValidate: true }, triggerUserBarcodeValidation);
      }
    }
  }

  onKeyDown = (e) => {
    if (e.key === ENTER_EVENT_KEY && !e.shiftKey) {
      e.preventDefault();
      this.handleClick(e.key);
    }
  }

  handleChange = (event) => {
    const { form } = this.props;
    const {
      isUserClicked,
      isUserBlurred,
      validatedBarcode,
    } = this.state;
    const barcode = event.target.value;

    if (isUserClicked || isUserBlurred) {
      this.setState({
        isUserClicked: false,
        isUserBlurred: false,
      });
    }
    if (!isNull(validatedBarcode)) {
      this.setState({ validatedBarcode: null });
    }

    form.change(REQUEST_FORM_FIELD_NAMES.REQUESTER_BARCODE, barcode);
  };

  handleBlur = (input) => () => {
    const { triggerUserBarcodeValidation } = this.props;
    const { validatedBarcode } = this.state;

    if (input.value && input.value !== validatedBarcode) {
      this.setState({
        shouldValidate: true,
        isUserBlurred: true,
        validatedBarcode: input.value,
      }, () => {
        input.onBlur();
        triggerUserBarcodeValidation();
      });
    } else if (!input.value) {
      input.onBlur();
    }
  }

  onSelectUser = (user) => {
    if (!user) {
      return;
    }

    const {
      onSetSelectedUser,
      findUser,
    } = this.props;

    onSetSelectedUser(null);

    if (user.barcode) {
      findUser(RESOURCE_KEYS.BARCODE, user.barcode);
    } else {
      findUser(RESOURCE_KEYS.ID, user.id);
    }
  }

  render() {
    const {
      request,
      values,
      selectedUser,
      submitting,
      patronGroup,
      isLoading,
      enterButtonClass,
    } = this.props;
    const {
      isUserClicked,
      isUserBlurred,
    } = this.state;
    const isEditForm = isFormEditing(request);
    const user = request ? request.requester : selectedUser;

    return (
      <Row>
        <Col xs={12}>
          {!isEditForm &&
          <Row>
            <Col xs={9}>
              <FormattedMessage id="ui-requests-mediated.form.requester.inputPlaceholder">
                {placeholder => {
                  const key = values.keyOfUserBarcodeField ?? 0;

                  return (
                    <Field
                      data-testid="requesterBarcodeField"
                      key={key}
                      name={REQUEST_FORM_FIELD_NAMES.REQUESTER_BARCODE}
                      validate={this.validate(REQUEST_FORM_FIELD_NAMES.REQUESTER_BARCODE, key)}
                      validateFields={[]}
                    >
                      {({ input, meta }) => {
                        const selectUserError = meta.touched && !selectedUser?.id && meta.error;
                        const userDoesntExistError = (isUserClicked || isUserBlurred) && meta.error;
                        const error = selectUserError || userDoesntExistError || null;

                        return (
                          <TextField
                            {...input}
                            required
                            placeholder={placeholder}
                            label={<FormattedMessage id="ui-requests-mediated.form.requester.inputLabel" />}
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
              <Pluggable
                aria-haspopup="true"
                type="find-user"
                searchLabel={<FormattedMessage id="ui-requests-mediated.form.requester.lookupLabel" />}
                searchButtonStyle="link"
                dataKey="users"
                selectUser={this.onSelectUser}
                visibleColumns={VISIBLE_COLUMNS}
                columnMapping={COLUMN_MAPPING}
                disableRecordCreation
                marginTop0
              />
            </Col>
            <Col xs={3}>
              <Button
                buttonStyle="primary noRadius"
                buttonClass={enterButtonClass}
                fullWidth
                onClick={this.handleClick}
                disabled={submitting}
              >
                <FormattedMessage id="ui-requests-mediated.form.enterButton" />
              </Button>
            </Col>
          </Row>}
          {(selectedUser?.id || isEditForm) &&
            <UserDetail
              user={user}
              request={request}
              patronGroup={patronGroup?.group}
            />
          }
          {
            isLoading && <Icon {...BASE_SPINNER_PROPS} />
          }
        </Col>
      </Row>
    );
  }
}

export default RequesterInformation;
