import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import MediatedRequests from './routes/MediatedRequests';
import Settings from './settings';

class RequestsMediated extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    })
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
          path={path}
          exact
          component={MediatedRequests}
        />
      </Switch>
    );
  }
}

export default RequestsMediated;
