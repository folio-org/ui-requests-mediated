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
import MediatedRequestsActions from './components/MediatedRequestsActions';
import SendItemInTransit from './components/SendItemInTransit';
import Settings from './settings';

import {
  CONFIRM_ITEM_ARRIVAL,
  MEDIATED_REQUESTS_ACTIONS,
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
          component={MediatedRequestsActions}
          path={`${path}/${MEDIATED_REQUESTS_ACTIONS}`}
        />
        <Route
          path={`${path}/${CONFIRM_ITEM_ARRIVAL}`}
          component={ConfirmItemArrival}
        />
        <Route
          path={`${path}/${SEND_ITEM_IN_TRANSIT}`}
          component={SendItemInTransit}
        />
        <Redirect to={`${path}/${MEDIATED_REQUESTS_ACTIONS}`} />
      </Switch>
    );
  }
}

export default RequestsMediated;
