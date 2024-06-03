import { stringify } from 'query-string';
import { getHeaderWithCredentials } from '@folio/stripes/util';
import { injectIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';

import {
  ITEM_QUERIES,
} from '../../constants';
import RequestFormContainer from '../../components/RequestFormContainer';
import { getInstanceQueryString } from '../../utils';

export const urls = {
  user: (value, idType) => {
    const query = stringify({ query: `(${idType}=="${value}")` });

    return {
      url: `users?${query}`,
    };
  },
  item: (value, idType) => {
    let query;
    const itemQueryParam = ITEM_QUERIES[idType];

    if (Array.isArray(value)) {
      const queryElements = value.map((valueItem) => `${itemQueryParam}=="${valueItem}"`);

      query = `(${queryElements.join(' or ')})`;
    } else {
      query = `(${itemQueryParam}=="${value}")`;
    }

    query = stringify({ query });

    return {
      url: `circulation/items-by-instance?${query}`,
    };
  },
  instance: (value) => {
    const query = stringify({ query: getInstanceQueryString(value) });

    return {
      url: `circulation/items-by-instance?${query}`,
    };
  },
  loan: (value) => {
    const query = stringify({ query: `(itemId=="${value}") and status.name==Open` });

    return {
      url: `circulation/loans?${query}`,
    };
  },
  requestPreferences: (value) => {
    const query = stringify({ query: `(userId=="${value}")` });

    return {
      url: `request-preference-storage/request-preference?${query}`,
    };
  },
  holding: (value, idType) => {
    const query = stringify({ query: `(${idType}=="${value}")` });

    return {
      url: `holdings-storage/holdings?${query}`,
    };
  },
};

const RequestRoute = (props) => {
  console.log('PROPS: ', props)
  const okapiUrl = props.stripes.okapi.url;
  const httpHeadersOptions = {
    ...getHeaderWithCredentials({
      tenant: props.stripes.okapi.tenant,
      token: props.stripes.store.getState().okapi.token,
    })
  };

  const findResource = (resource, value, idType = 'id') => {
    const { stripes } = props;
    const {
      url,
      headers,
    } = urls[resource](value, idType, stripes);

    return fetch(`${okapiUrl}/${url}`, {
      headers: headers || httpHeadersOptions.headers,
      credentials: httpHeadersOptions.credentials,
    }).then(response => response.json());
  }

  return (
    <RequestFormContainer
      {...props}
      findResource={findResource}
    />
  );
};

export default stripesConnect(injectIntl(RequestRoute));