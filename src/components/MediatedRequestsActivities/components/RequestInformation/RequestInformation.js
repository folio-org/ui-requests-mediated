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
import { useStripes } from '@folio/stripes/core';

import {
  MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS,
  MEDIATED_REQUEST_FORM_FIELD_NAMES,
  DEFAULT_REQUEST_TYPE_VALUE,
  REQUEST_PROP_TYPES,
} from '../../../../constants';

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
  isEditMode,
}) => {
  const stripes = useStripes();
  const isEditPermission = stripes.hasPerm('ui-requests-mediated.requests-mediated.view-create-edit.execute');
  const isMetadata = isEditMode && request?.metadata;
  const isItemOrTitleSelected = isTitleLevelRequest ? isSelectedInstance : isSelectedItem;
  const isRequestTypeDisabled = requestTypeOptions.length === 0 || !(isItemOrTitleSelected && isSelectedUser) || !isEditPermission;

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
                name={MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE}
                validateFields={[]}
              >
                {({
                  input,
                  meta,
                }) => {
                  const noAvailableRequestTypesError = !isRequestTypeLoading && isRequestTypesReceived && requestTypeOptions.length === 0 && meta.error;
                  const error = noAvailableRequestTypesError || null;

                  return (
                    <Select
                      {...input}
                      label={<FormattedMessage id="ui-requests-mediated.form.request.requestType" />}
                      disabled={isRequestTypeDisabled}
                      error={error}
                      fullWidth
                    >
                      <FormattedMessage id="ui-requests-mediated.form.request.selectRequestType">
                        {optionLabel => <option value={DEFAULT_REQUEST_TYPE_VALUE}>{optionLabel}</option>}
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
            {isEditMode &&
              <Col
                xsOffset={1}
                xs={3}
              >
                <KeyValue
                  label={<FormattedMessage id="ui-requests-mediated.form.request.status" />}
                  value={(MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[request?.status]
                    ? <FormattedMessage id={MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[request.status]} />
                    : <NoValue />)}
                />
              </Col>
            }
            <Col
              xsOffset={1}
              xs={4}
            >
              <Field
                name={MEDIATED_REQUEST_FORM_FIELD_NAMES.PATRON_COMMENTS}
                disabled={!isEditPermission}
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
  isEditMode: PropTypes.bool.isRequired,
  request: REQUEST_PROP_TYPES,
  values: PropTypes.shape({
    keyOfRequestTypeField: PropTypes.string,
  }).isRequired,
  requestTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.string,
  })),
};

export default RequestInformation;
