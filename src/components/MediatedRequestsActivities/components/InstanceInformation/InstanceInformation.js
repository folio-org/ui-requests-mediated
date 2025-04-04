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
import {
  Pluggable,
  stripesConnect,
} from '@folio/stripes/core';

import {
  BASE_SPINNER_PROPS,
  ENTER_EVENT_KEY,
  MEDIATED_REQUEST_FORM_FIELD_NAMES,
  DEFAULT_REQUEST_TYPE_VALUE,
  REQUEST_PROP_TYPES,
} from '../../../../constants';
import TitleInformation from '../TitleInformation';
import { memoizeValidation } from '../../../../utils';

import css from './InstanceInformation.css';

export const INSTANCE_SEGMENT_FOR_PLUGIN = 'instances';

class InstanceInformation extends Component {
  static propTypes = {
    triggerValidation: PropTypes.func.isRequired,
    findInstance: PropTypes.func.isRequired,
    getInstanceValidationData: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    form: PropTypes.shape({
      change: PropTypes.func.isRequired,
    }).isRequired,
    values: PropTypes.shape({
      keyOfInstanceIdField: PropTypes.string,
      instance: PropTypes.shape({
        hrid: PropTypes.string,
      }),
    }).isRequired,
    onSetSelectedInstance: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    enterButtonClass: PropTypes.string.isRequired,
    isInstancePreselected: PropTypes.bool.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    request: REQUEST_PROP_TYPES,
    selectedInstance: PropTypes.shape({
      id: PropTypes.string,
      hrid: PropTypes.string,
      instanceId: PropTypes.string,
      title: PropTypes.string,
      contributors: PropTypes.string,
      publications: PropTypes.string,
      editions: PropTypes.string,
      identifiers: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      shouldValidate: false,
      isInstanceClicked: false,
      isInstanceBlurred: false,
      validatedId: null,
    };
  }

  componentDidUpdate(prevProps) {
    const {
      isInstancePreselected,
      selectedInstance,
      isEditMode,
      triggerValidation,
      request,
    } = this.props;
    const isNewPreselectedValue = isInstancePreselected && isInstancePreselected !== prevProps.isInstancePreselected;

    if (selectedInstance && isNewPreselectedValue) {
      this.setState({ validatedId: selectedInstance.hrid });
    }

    if (isEditMode && !selectedInstance && isNewPreselectedValue) {
      this.setState({
        validatedId: request?.instance?.hrid,
        shouldValidate: true,
      }, triggerValidation);
    }
  }

  validate = memoizeValidation(async (instanceId) => {
    const { getInstanceValidationData } = this.props;
    const { shouldValidate } = this.state;

    if (!instanceId) {
      return <FormattedMessage id="ui-requests-mediated.form.errors.selectInstance" />;
    }

    if (instanceId && shouldValidate) {
      this.setState({ shouldValidate: false });

      const instance = await getInstanceValidationData(instanceId);

      return !instance
        ? <FormattedMessage id="ui-requests-mediated.form.errors.titleDoesNotExist" />
        : undefined;
    }

    return undefined;
  });

  handleChange = (event) => {
    const { form } = this.props;
    const {
      isInstanceClicked,
      isInstanceBlurred,
      validatedId,
    } = this.state;
    const instanceId = event.target.value;

    if (isInstanceClicked || isInstanceBlurred) {
      this.setState({
        isInstanceClicked: false,
        isInstanceBlurred: false,
      });
    }

    if (!isNull(validatedId)) {
      this.setState({ validatedId: null });
    }

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, instanceId);
  };

  resetInstance = () => {
    const {
      form,
      onSetSelectedInstance,
    } = this.props;

    form.change(MEDIATED_REQUEST_FORM_FIELD_NAMES.REQUEST_TYPE, DEFAULT_REQUEST_TYPE_VALUE);
    onSetSelectedInstance(null);
  };

  handleBlur = (input) => () => {
    const { triggerValidation } = this.props;
    const { validatedId } = this.state;

    if (input.value && input.value !== validatedId) {
      this.resetInstance();
      this.setState({
        shouldValidate: true,
        isInstanceBlurred: true,
        validatedId: input.value,
      }, () => {
        input.onBlur();
        triggerValidation();
      });
    } else if (!input.value) {
      this.resetInstance();
      input.onBlur();
    }
  };

  handleClick = (eventKey) => {
    const {
      values,
      onSetSelectedInstance,
      findInstance,
      triggerValidation,
    } = this.props;
    const instanceId = values.instance?.hrid;

    if (instanceId) {
      onSetSelectedInstance(null);
      this.setState({ isInstanceClicked: true });
      findInstance(instanceId);

      if (eventKey === ENTER_EVENT_KEY) {
        this.setState({
          shouldValidate: true,
          validatedId: instanceId,
        }, triggerValidation);
      }
    }
  };

  onKeyDown = (e) => {
    if (e.key === ENTER_EVENT_KEY && !e.shiftKey) {
      e.preventDefault();
      this.handleClick(e.key);
    }
  };

  selectInstance = (instanceFromPlugin) => {
    this.setState({ validatedId: instanceFromPlugin.hrid });

    return this.props.findInstance(instanceFromPlugin.hrid);
  };

  render() {
    const {
      selectedInstance,
      submitting,
      values,
      isLoading,
      enterButtonClass,
      stripes,
      isEditMode,
    } = this.props;
    const {
      isInstanceClicked,
      isInstanceBlurred,
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
              <FormattedMessage id="ui-requests-mediated.form.instance.inputPlaceholder">
                {placeholder => {
                  const key = values.keyOfInstanceIdField ?? 0;

                  return (
                    <Field
                      data-testid="instanceHridField"
                      key={key}
                      name={MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID}
                      validate={this.validate(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, key)}
                      validateFields={[]}
                    >
                      {({ input, meta }) => {
                        const selectInstanceError = meta.touched && meta.error;
                        const instanceDoesntExistError = (isInstanceClicked || isInstanceBlurred || (isEditMode && !selectedInstance)) && meta.error;
                        const error = selectInstanceError || instanceDoesntExistError || null;

                        return (
                          <TextField
                            {...input}
                            required
                            placeholder={placeholder}
                            label={<FormattedMessage id="ui-requests-mediated.form.instance.inputLabel" />}
                            error={error}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur(input)}
                            onKeyDown={this.onKeyDown}
                            disabled={!isEditPermission}
                            className={css.instanceHridField}
                          />
                        );
                      }}
                    </Field>
                  );
                }}
              </FormattedMessage>
              <Button
                id="selectInstanceButton"
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
            isEditPermission &&
              <Row>
                <Col xs={12}>
                  <Pluggable
                    searchButtonStyle="link"
                    type="find-instance"
                    searchLabel={<FormattedMessage id="ui-requests-mediated.form.instance.lookupLabel" />}
                    selectInstance={this.selectInstance}
                    config={{
                      availableSegments: [{
                        name: INSTANCE_SEGMENT_FOR_PLUGIN,
                      }],
                    }}
                  />
                </Col>
              </Row>
          }
          {
            isLoading && <Icon {...BASE_SPINNER_PROPS} />
          }
          {
            selectedInstance &&
              <TitleInformation
                instanceId={selectedInstance.id}
                title={selectedInstance.title}
                contributors={selectedInstance.contributors}
                publications={selectedInstance.publication}
                editions={selectedInstance.editions}
                identifiers={selectedInstance.identifiers}
              />
          }
        </Col>
      </Row>
    );
  }
}

export default stripesConnect(InstanceInformation);
