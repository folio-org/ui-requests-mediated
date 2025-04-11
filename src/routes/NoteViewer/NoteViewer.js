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
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      referredRecordData: PropTypes.shape({
        instanceId: PropTypes.string.isRequired,
        instanceTitle: PropTypes.string.isRequired,
        itemBarcode: PropTypes.string.isRequired,
        itemId: PropTypes.string.isRequired,
        holdingsRecordId: PropTypes.string.isRequired,
        requestCreateDate: PropTypes.string.isRequired,
        requesterId: PropTypes.string.isRequired,
        requesterName: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      noteId: PropTypes.string,
    }),
  }).isRequired,
};

export default NoteViewer;
