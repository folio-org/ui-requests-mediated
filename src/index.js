import React from 'react';
import PropTypes from 'prop-types';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  Route,
  Switch,
  Redirect,
} from '@folio/stripes/core';

import ConfirmItemArrival from './components/ConfirmItemArrival';
import MediatedRequestsActivities from './components/MediatedRequestsActivities';
import SendItemInTransit from './components/SendItemInTransit';
import Settings from './settings';

import {
  CONFIRM_ITEM_ARRIVAL,
  MEDIATED_REQUESTS_ACTIVITIES,
  SEND_ITEM_IN_TRANSIT,
} from './constants';

class RequestsMediated extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  };

  render() {
    const {
      showSettings,
      match: {
        path,
      },
    } = this.props;

    if (showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          component={MediatedRequestsActivities}
          path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}`}
        />
        <Route
          path={`${path}/${CONFIRM_ITEM_ARRIVAL}`}
          component={ConfirmItemArrival}
        />
        <Route
          path={`${path}/${SEND_ITEM_IN_TRANSIT}`}
          component={SendItemInTransit}
        />
        <Redirect to={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}`} />
      </Switch>
    );
  }
}

export default RequestsMediated;
