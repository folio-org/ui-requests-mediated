import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
  Select,
  TextArea,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  REQUEST_STATUSES_TRANSLATIONS,
  REQUEST_FORM_FIELD_NAMES,
} from '../../../../constants';
import {
  isFormEditing,
  resetFieldState,
  getNoRequestTypeErrorMessageId,
} from '../../../../utils';

const RequestInformation = ({
  request,
  requestTypeOptions,
  isTitleLevelRequest,
  isSelectedInstance,
  isSelectedItem,
  isSelectedUser,
  isRequestTypesReceived,
  isRequestTypeLoading,
  values,
  form,
  updateRequestPreferencesFields,
  shouldValidate,
}) => {
  const isEditForm = isFormEditing(request);
  const isMetadata = isEditForm && request?.metadata;
  const isItemOrTitleSelected = isTitleLevelRequest ? isSelectedInstance : isSelectedItem;
  const isRequestTypeDisabled = requestTypeOptions.length === 0 || !(isItemOrTitleSelected && isSelectedUser);
  const validateRequestType = useCallback((requestType) => {
    if (isItemOrTitleSelected && isSelectedUser && shouldValidate) {
      if (requestTypeOptions.length === 0 && isRequestTypesReceived) {
        return <FormattedMessage id={getNoRequestTypeErrorMessageId(isTitleLevelRequest)} />;
      }

      if (!requestType && requestTypeOptions.length !== 0) {
        return <FormattedMessage id="ui-requests-mediated.form.errors.requiredToConfirm" />;
      }
    }

    return undefined;
  }, [isItemOrTitleSelected, isSelectedUser, requestTypeOptions, isTitleLevelRequest, isRequestTypesReceived]);
  const changeRequestType = (input) => (e) => {
    form.change(REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID, undefined);
    resetFieldState(form, REQUEST_FORM_FIELD_NAMES.PICKUP_SERVICE_POINT_ID);
    input.onChange(e);
    updateRequestPreferencesFields();
  };

  return (
    <>
      {isMetadata &&
        <Col xs={12}>
          <ViewMetaData metadata={request.metadata} />
        </Col>
      }
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={3}>
              <Field
                data-testid="requestTypeDropDown"
                key={values.keyOfRequestTypeField ?? 0}
                name={REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE}
                validateFields={[]}
                validate={validateRequestType}
              >
                {({
                  input,
                  meta,
                }) => {
                  const selectItemError = requestTypeOptions.length !== 0 && meta.touched && meta.error;
                  const noAvailableRequestTypesError = !isRequestTypeLoading && isRequestTypesReceived && requestTypeOptions.length === 0 && meta.error;
                  const error = selectItemError || noAvailableRequestTypesError || null;

                  return (
                    <Select
                      {...input}
                      label={<FormattedMessage id="ui-requests-mediated.form.request.requestType" />}
                      disabled={isRequestTypeDisabled}
                      error={error}
                      onChange={changeRequestType(input)}
                      fullWidth
                    >
                      <FormattedMessage id="ui-requests-mediated.form.request.selectRequestType">
                        {optionLabel => <option value="">{optionLabel}</option>}
                      </FormattedMessage>
                      {requestTypeOptions.map(({
                        id,
                        value,
                      }) => (
                        <FormattedMessage
                          id={id}
                          key={id}
                        >
                          {translatedLabel => (
                            <option value={value}>
                              {translatedLabel}
                            </option>
                          )}
                        </FormattedMessage>
                      ))}
                    </Select>
                  );
                }}
              </Field>
            </Col>
            {isEditForm &&
              <Col xs={3}>
                <KeyValue
                  label={<FormattedMessage id="ui-requests-mediated.form.request.status" />}
                  value={(REQUEST_STATUSES_TRANSLATIONS[request.status]
                    ? <FormattedMessage id={REQUEST_STATUSES_TRANSLATIONS[request.status]} />
                    : <NoValue />)}
                />
              </Col>
            }
            <Col
              xsOffset={1}
              xs={4}
            >
              <Field
                name="patronComments"
                id="patronComments"
                label={<FormattedMessage id="ui-requests-mediated.form.request.patronComments" />}
                component={TextArea}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

RequestInformation.propTypes = {
  isTitleLevelRequest: PropTypes.bool.isRequired,
  isSelectedInstance: PropTypes.bool.isRequired,
  isSelectedItem: PropTypes.bool.isRequired,
  isSelectedUser: PropTypes.bool.isRequired,
  isRequestTypesReceived: PropTypes.bool.isRequired,
  isRequestTypeLoading: PropTypes.bool.isRequired,
  shouldValidate: PropTypes.bool.isRequired,
  request: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateRequestPreferencesFields: PropTypes.func.isRequired,
  requestTypeOptions: PropTypes.arrayOf(PropTypes.object),
};

export default RequestInformation;
