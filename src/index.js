import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { parse } from 'query-string';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  Route,
  Switch,
  Redirect,
  useStripes,
  TitleManager,
} from '@folio/stripes/core';

import ConfirmItemArrival from './components/ConfirmItemArrival';
import MediatedRequestsActivitiesContainer from './routes/MediatedRequestsActivitiesContainer';
import NoteCreator from './routes/NoteCreator';
import NoteEditor from './routes/NoteEditor';
import NoteViewer from './routes/NoteViewer';
import MediatedRequestsDetail from './components/MediatedRequestsActivities/components/MediatedRequestsDetail';
import SendItemInTransit from './components/SendItemInTransit';
import RequestFormContainer from './components/MediatedRequestsActivities/components/RequestFormContainer';

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
  const stripes = useStripes();
  const location = useLocation();
  const { formatMessage } = useIntl();
  const [request, setRequest] = useState(null);
  const { settings } = useGeneralTlrSettings(!props.showSettings);
  const { patronGroups } = usePatronGroups(!props.showSettings);
  const getPageTitle = () => {
    const query = parse(location.search)?.query;

    if (query) {
      return formatMessage(
        { id: 'ui-requests-mediated.meta.searchTitle' },
        { query },
      );
    }

    return formatMessage({ id: 'ui-requests-mediated.meta.title' });
  };

  const {
    match: {
      path,
    },
  } = props;
  const pageTitle = getPageTitle();
  const isRequestCreationAvailable = stripes.hasPerm('ui-requests-mediated.requests-mediated.view-create-edit.execute');
  const isRequestEditingAvailable = isRequestCreationAvailable || stripes.hasPerm('ui-requests-mediated.requests-mediated.view-confirm.execute');

  return (
    <>
      <TitleManager page={pageTitle} />
      <Switch>
        {
          isRequestCreationAvailable &&
          <Route path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}/create`}>
            <RequestFormContainer
              isEditMode={false}
              settings={settings}
              patronGroups={patronGroups?.usergroups}
            />
          </Route>
        }
        {
          isRequestEditingAvailable &&
          <Route path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}/edit/:id`}>
            <RequestFormContainer
              isEditMode
              setRequest={setRequest}
              request={request}
              settings={settings}
              patronGroups={patronGroups?.usergroups}
            />
          </Route>
        }
        <Route path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}/preview/:id`}>
          <MediatedRequestsActivitiesContainer
            {...props}
            settings={settings}
          >
            <MediatedRequestsDetail
              {...props}
              patronGroups={patronGroups?.usergroups}
              setRequest={setRequest}
            />
          </MediatedRequestsActivitiesContainer>
        </Route>
        <Route
          path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}/notes/new`}
          component={NoteCreator}
        />
        <Route
          path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}/notes/:noteId/edit`}
          component={NoteEditor}
        />
        <Route
          path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}/notes/:noteId`}
          component={NoteViewer}
        />
        <Route path={`${path}/${MEDIATED_REQUESTS_ACTIVITIES}`}>
          <MediatedRequestsActivitiesContainer
            {...props}
            settings={settings}
          />
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
    </>
  );
};

RequestsMediated.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  showSettings: PropTypes.bool,
};

export default RequestsMediated;
