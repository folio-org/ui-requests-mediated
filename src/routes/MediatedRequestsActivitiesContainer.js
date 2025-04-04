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
  MEDIATED_REQUESTS_RECORD_FIELD_NAME,
  SEARCH_FIELDS,
  FILTER_CONFIG,
  CONTENT_DATA_PROP_TYPES,
} from '../constants';

export const buildQuery = (queryParams, pathComponents, resourceData, logger, props) => {
  const customFilterConfig = buildFilterConfig(queryParams.filters);
  const mapFields = (index) => `${index}=="%{query.query}*"`;
  const getCql = makeQueryFunction(
    'cql.allRecords=1',
    SEARCH_FIELDS.map(mapFields).join(' or '),
    {
      [MEDIATED_REQUESTS_RECORD_FIELD_NAME.REQUESTER]: `${MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_LAST_NAME} ${MEDIATED_REQUESTS_RECORD_FIELD_NAME.USER_FIRST_NAME}`,
    },
    [...FILTER_CONFIG, ...customFilterConfig],
    2,
  );

  return getCql(queryParams, pathComponents, resourceData, logger, props);
};

export const updateMediatedRequestList = (source, props) => {
  const {
    location,
    history,
  } = props;
  const {
    resources: {
      query,
    },
  } = source;
  const url = buildUrl(location, query);

  history.push(url);
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
      records: 'mediatedRequests',
      resultOffset: '%{resultOffset}',
      resultDensity: 'sparse',
      perRequest: PAGE_AMOUNT,
      path: 'requests-mediated/mediated-requests',
      GET: {
        params: {
          query: buildQuery,
        },
      },
      resourceShouldRefresh: true,
      throwErrors: false,
    },
    reportRecords: {
      type: 'okapi',
      path: 'requests-mediated/mediated-requests',
      records: 'mediatedRequests',
      throwErrors: false,
      accumulate: true,
    },
  });

  static propTypes = {
    location:  PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    resources: PropTypes.shape({
      query: PropTypes.shape({
        query: PropTypes.string,
        sort: PropTypes.string,
      }),
      [MEDIATED_REQUESTS_RECORDS_NAME]: PropTypes.shape({
        records: CONTENT_DATA_PROP_TYPES,
      }),
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
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      hasPerm: PropTypes.func.isRequired,
    }).isRequired,
    settings: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.shape({
          titleLevelRequestsFeatureEnabled: PropTypes.bool,
        }),
      })),
    }),
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
    const isAnyFilterSelected = Object.keys(state.filterFields).some(filterName => state.filterFields[filterName]?.length);

    if (nsValues.query) {
      nsValues.query = nsValues.query.replace('*', '');
    }

    if (state.sortChanged) {
      resultOffset.replace(0);
    }

    if (/reset/.test(state.changeType) && !isAnyFilterSelected) {
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

  onNeedMoreData = (askAmount, index) => {
    const {
      resultOffset,
    } = this.props.mutator;

    if (this.source) {
      if (resultOffset && index >= 0) {
        this.source.fetchOffset(index);
      } else {
        this.source.fetchMore(PAGE_AMOUNT);
      }
    }
  };

  updateMediatedRequestList = () => {
    updateMediatedRequestList(this.source, this.props);
  };

  render() {
    if (this.source) {
      this.source.update(this.props, MEDIATED_REQUESTS_RECORDS_NAME);
    }

    return (
      <MediatedRequestsActivities
        source={this.source}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        onNeedMoreData={this.onNeedMoreData}
        resources={this.props.resources}
        mutator={this.props.mutator}
        settings={this.props.settings}
      >
        {
          React.Children.map(
            this.props.children, child => React.cloneElement(child, {
              updateMediatedRequestList: this.updateMediatedRequestList,
            })
          )
        }
      </MediatedRequestsActivities>
    );
  }
}

export default stripesConnect(MediatedRequestsActivitiesContainer);
