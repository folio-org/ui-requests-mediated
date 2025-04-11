import PropTypes from 'prop-types';
import { Redirect } from 'react-router';

import { NoteEditPage } from '@folio/stripes/smart-components';

import ReferredRecord from '../../components/MediatedRequestsActivities/components/RefferedRecord';
import { formatNoteReferrerEntityData } from '../../utils';
import {
  APP_ICON_NAME,
  STAFF_NOTES_DOMAIN_NAME,
  STAFF_NOTES_ENTITY_TYPE,
  getMediatedRequestsActivitiesUrl,
} from '../../constants';

const NoteEditor = ({
  location,
  history,
  match,
}) => {
  if (location.state) {
    const getReferredRecord = () => <ReferredRecord values={location.state.referredRecordData} />;

    return (
      <NoteEditPage
        data-testid="noteEditPage"
        domain={STAFF_NOTES_DOMAIN_NAME}
        entityTypePluralizedTranslationKeys={{ [STAFF_NOTES_ENTITY_TYPE]: 'ui-requests-mediated.notes.entityType.request.pluralized' }}
        entityTypeTranslationKeys={{ [STAFF_NOTES_ENTITY_TYPE]: 'ui-requests-mediated.notes.entityType.request' }}
        navigateBack={history.goBack}
        noteId={match.params.noteId}
        paneHeaderAppIcon={APP_ICON_NAME}
        renderReferredRecord={getReferredRecord}
        referredEntityData={formatNoteReferrerEntityData(location.state)}
      />
    );
  }

  return <Redirect to={getMediatedRequestsActivitiesUrl()} />;
};

NoteEditor.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
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

export default NoteEditor;
