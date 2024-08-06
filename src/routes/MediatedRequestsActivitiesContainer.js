import React from 'react';
import PropTypes from 'prop-types';

import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
  buildUrl,
} from '@folio/stripes/smart-components';

import MediatedRequestsActivities from '../components/MediatedRequestsActivities';

import {
  buildFilterConfig,
} from './utils';
import {
  PAGE_AMOUNT,
  MEDIATED_REQUESTS_RECORDS_NAME,
  MEDIATED_REQUEST_FILTER_TYPES,
  MEDIATED_REQUEST_SEARCH_PARAMS,
} from '../constants';

export const buildQuery = (queryParams, pathComponents, resourceData, logger, props) => {
  const SEARCH_FIELDS = [
    MEDIATED_REQUEST_SEARCH_PARAMS.INSTANCE_TITLE,
    MEDIATED_REQUEST_SEARCH_PARAMS.ITEM_BARCODE,
    MEDIATED_REQUEST_SEARCH_PARAMS.REQUESTER_BARCODE,
    MEDIATED_REQUEST_SEARCH_PARAMS.CALL_NUMBER,
    MEDIATED_REQUEST_SEARCH_PARAMS.FULL_CALL_NUMBER,
  ];
  const FILTER_CONFIG = [
    {
      name: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS,
      cql: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS,
      values: [],
      operator: '==',
    },
    {
      name: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS,
      cql: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS,
      values: [],
      operator: '==',
    },
  ];
  const customFilterConfig = buildFilterConfig(queryParams.filters);
  const mapFields = (index) => `${index}=="%{query.query}*"`;
  const getCql = makeQueryFunction(
    'cql.allRecords=1',
    SEARCH_FIELDS.map(mapFields).join(' or '),
    {},
    [...FILTER_CONFIG, ...customFilterConfig],
    2,
  );

  return getCql(queryParams, pathComponents, resourceData, logger, props);
};

class MediatedRequestsActivitiesContainer extends React.Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {},
    },
    resultCount: {
      initialValue: PAGE_AMOUNT,
    },
    resultOffset: {
      initialValue: 0,
    },
    [MEDIATED_REQUESTS_RECORDS_NAME]: {
      type: 'okapi',
      resultOffset: '%{resultOffset}',
      perRequest: PAGE_AMOUNT,
      path: 'requests-mediated/mediated-requests',
      GET: {
        params: {
          query: buildQuery,
        },
      },
      throwErrors: false,
    },
  });

  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    resources: PropTypes.shape({
      query: PropTypes.object,
      [MEDIATED_REQUESTS_RECORDS_NAME]: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      [MEDIATED_REQUESTS_RECORDS_NAME]: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
      }).isRequired,
      resultOffset: PropTypes.shape({
        replace: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    stripes: PropTypes.shape({
      logger: PropTypes.object.isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    settings: PropTypes.object.isRequired,
    children: PropTypes.node,
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.props.stripes.logger, MEDIATED_REQUESTS_RECORDS_NAME);
  }

  componentDidUpdate() {
    this.source.update(this.props, MEDIATED_REQUESTS_RECORDS_NAME);
  }

  querySetter = ({ nsValues, state }) => {
    const {
      location,
      location: {
        pathname,
        search,
      },
      history,
      mutator: {
        query,
        resultOffset,
      },
    } = this.props;

    if (nsValues.query) {
      nsValues.query = nsValues.query.replace('*', '');
    }

    if (state.sortChanged) {
      resultOffset.replace(0);
    }

    if (/reset/.test(state.changeType)) {
      query.replace(nsValues);
    } else {
      query.update(nsValues);
    }

    const url = buildUrl(location, nsValues);

    if (`${pathname}${search}` !== url) {
      history.push(url);
    }
  }

  queryGetter = () => {
    return this.props?.resources?.query ?? {};
  }

  render() {
    if (this.source) {
      this.source.update(this.props, MEDIATED_REQUESTS_RECORDS_NAME);
    }

    return (
      <MediatedRequestsActivities
        source={this.source}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        resources={this.props.resources}
        mutator={this.props.mutator}
        settings={this.props.settings}
      >
        {this.props.children}
      </MediatedRequestsActivities>
    );
  }
}

export default stripesConnect(MediatedRequestsActivitiesContainer);
