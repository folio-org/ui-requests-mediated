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
import RequestFormContainer from './components/MediatedRequestsActivities/components/RequestFormContainer';
import Settings from './settings';

import {
  CONFIRM_ITEM_ARRIVAL,
  MEDIATED_REQUESTS_ACTIVITIES,
  SEND_ITEM_IN_TRANSIT,
} from './constants';
import {
  useGeneralTlrSettings,
  usePatronGroups,
} from './hooks';

const RequestsMediated = (props) => {
  if (props.showSettings) {
    return <Settings {...props}/>;
  }

  const { settings } = useGeneralTlrSettings();
  const { patronGroups } = usePatronGroups();
  const {
    match: {
      path,
    },
  } = props;

  return (
    <Switch>
      <Route path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}/create`}>
        <RequestFormContainer
          settings={settings}
          patronGroups={patronGroups}
        />
      </Route>
      <Route path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}`} >
        <MediatedRequestsActivities settings={settings} />
      </Route>
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
};

RequestsMediated.propTypes = {
  match: PropTypes.object.isRequired,
  showSettings: PropTypes.bool,
};

export default RequestsMediated;
