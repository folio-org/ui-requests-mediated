import {
  get, includes,
  isObject,
} from 'lodash';
import {
  ID_TYPE_MAP,
  REQUEST_LEVEL_TYPES,
  DCB_HOLDINGS_RECORD_ID,
  DCB_INSTANCE_ID,
  INVALID_REQUEST_HARDCODED_ID
} from './constants';
import {Link} from "react-router-dom";
import {Col, Headline, NoValue, Row} from "@folio/stripes/components";
import css from "@folio/requests/src/requests.css";
import {FormattedMessage} from "react-intl";
import React from "react";

export const getRequestLevelValue = (value) => {
  return value
    ? REQUEST_LEVEL_TYPES.TITLE
    : REQUEST_LEVEL_TYPES.ITEM;
};

export const isMultiDataTenant = (stripes) => {
  return stripes.hasInterface('consortia') && stripes.hasInterface('ecs-tlr');
};

export const handleKeyCommand = (handler, { disabled } = {}) => {
  return (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!disabled) {
      handler();
    }
  };
};

export const getPatronGroup = (patron, patronGroups) => {
  const group = get(patron, 'patronGroup');

  if (!group || !patronGroups.length) {
    return undefined;
  }

  const id = isObject(group) ? group.id : group;

  return patronGroups.find(g => (g.id === id));
};

export const getProxy = (request, proxy) => {
  const userProxy = request ? request.proxy : proxy;

  if (!userProxy){
    return null;
  }

  const id = proxy?.id || request?.proxyUserId;

  return {
    ...userProxy,
    id,
  };
};

export const isSubmittingButtonDisabled = (pristine, submitting) => {
  return pristine || submitting;
};

export const isFormEditing = (request) => {
  return !!get(request, 'id');
};

export const resetFieldState = (form, fieldName) => {
  const registeredFields = form.getRegisteredFields();

  if (includes(registeredFields, fieldName)) {
    form.resetFieldState(fieldName);
  }
};

export const getResourceTypeId = (isTitleLevelRequest) => (isTitleLevelRequest ? ID_TYPE_MAP.INSTANCE_ID : ID_TYPE_MAP.ITEM_ID);

export const isTLR = (createTitleLevelRequest, requestLevel) => (createTitleLevelRequest || requestLevel === REQUEST_LEVEL_TYPES.TITLE);

export const getRequestInformation = (values, selectedInstance, selectedItem, request) => {
  const isTitleLevelRequest = isTLR(values.createTitleLevelRequest, request?.requestLevel);
  const selectedResource = isTitleLevelRequest ? selectedInstance : selectedItem;

  return {
    isTitleLevelRequest,
    selectedResource,
  };
};

export const isValidRequest = ({
  instanceId,
  holdingsRecordId,
}) => instanceId !== INVALID_REQUEST_HARDCODED_ID && holdingsRecordId !== INVALID_REQUEST_HARDCODED_ID;

/*
  DCB Transactions (where FOLIO plays a) borrowing role work with virtual items,
  whose instance and holding record id are hard coded
*/
export const isVirtualItem = (
  instanceId,
  holdingsRecordId,
) => {
  return instanceId === DCB_INSTANCE_ID && holdingsRecordId === DCB_HOLDINGS_RECORD_ID;
};

export const memoizeValidation = (fn) => {
  const lastArgs = {};
  const lastKeys = {};
  const lastResults = {};

  return (fieldName, key) => arg => {
    const lastArg = lastArgs[fieldName];
    const lastKey = lastKeys[fieldName];

    if (
      arg !== lastArg ||
      (key !== lastKey && arg === lastArg)
    ) {
      lastArgs[fieldName] = arg;
      lastKeys[fieldName] = key;
      lastResults[fieldName] = fn(arg);
    }

    return lastResults[fieldName];
  };
};

export const getInstanceQueryString = (hrid, id) => `("hrid"=="${hrid}" or "id"=="${id || hrid}")`;

export const getFullName = (user) => {
  const userNameObj = user?.personal || user;
  const lastName = get(userNameObj, ['lastName'], '');
  const firstName = get(userNameObj, ['firstName'], '');
  const middleName = get(userNameObj, ['middleName'], '');
  const preferredFirstName = get(userNameObj, ['preferredFirstName'], '');
  const displayedFirstName = preferredFirstName || firstName;

  return `${lastName}${displayedFirstName ? ', ' : ' '}${displayedFirstName} ${middleName}`;
}

export const createUserHighlightBoxLink = (linkText, id) => {
  return linkText ? <Link to={`/users/view/${id}`}>{linkText}</Link> : '';
};

export const userHighlightBox = (title, name, id, barcode) => {
  const recordLink = createUserHighlightBoxLink(name, id);
  const barcodeLink = createUserHighlightBoxLink(barcode, id);

  return (
    <Row>
      <Col xs={12}>
        <div className={`${css.section} ${css.active}`}>
          <Headline size="medium" tag="h3">
            {title}
          </Headline>
          <div>
            {recordLink}
            {' '}
            <FormattedMessage id="ui-requests.barcode" />:
            {' '}
            {barcode ? barcodeLink : <NoValue />}
          </div>
        </div>
      </Col>
    </Row>
  );
}
