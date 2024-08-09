import PropTypes from 'prop-types';
import { Redirect } from 'react-router';

import { NoteViewPage } from '@folio/stripes/smart-components';

import ReferredRecord from '../../components/MediatedRequestsActivities/components/RefferedRecord';
import { formatNoteReferrerEntityData } from '../../utils';
import {
  APP_ICON_NAME,
  STAFF_NOTES_ENTITY_TYPE,
  getMediatedRequestsActivitiesUrl,
} from '../../constants';

const NoteViewer = ({
  location,
  match,
  history,
}) => {
  const { noteId } = match.params;
  const mediatedRequestActivitiesUrl = getMediatedRequestsActivitiesUrl();

  const onEdit = () => {
    history.replace({
      pathname: `${mediatedRequestActivitiesUrl}/notes/${noteId}/edit`,
      state: location.state,
    });
  };

  if (location.state) {
    const getReferredRecord = () => <ReferredRecord values={location.state.referredRecordData} />;

    return (
      <NoteViewPage
        data-testid="noteViewPage"
        entityTypeTranslationKeys={{ [STAFF_NOTES_ENTITY_TYPE]: 'ui-requests-mediated.notes.entityType.request' }}
        entityTypePluralizedTranslationKeys={{ [STAFF_NOTES_ENTITY_TYPE]: 'ui-requests-mediated.notes.entityType.request.pluralized' }}
        navigateBack={history.goBack}
        onEdit={onEdit}
        paneHeaderAppIcon={APP_ICON_NAME}
        referredEntityData={formatNoteReferrerEntityData(location.state)}
        noteId={noteId}
        renderReferredRecord={getReferredRecord}
      />
    );
  }

  return <Redirect to={mediatedRequestActivitiesUrl} />;
};

NoteViewer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default NoteViewer;
