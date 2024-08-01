import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { FormattedMessage } from 'react-intl';

import { NoteCreatePage } from '@folio/stripes/smart-components';

import ReferredRecord from '../../components/MediatedRequestsActivities/components/RefferedRecord';
import { formatNoteReferrerEntityData } from '../../utils';
import {
  APP_ICON_NAME,
  STAFF_NOTES_DOMAIN_NAME,
  STAFF_NOTES_ENTITY_TYPE,
  getMediatedRequestsActivitiesUrl,
} from '../../constants';

const NoteCreator = ({
  location,
  history,
}) => {
  if (location.state) {
    const getReferredRecord = () => <ReferredRecord values={location.state.referredRecordData} />;

    return (
      <NoteCreatePage
        data-testid="noteCreatePage"
        referredEntityData={formatNoteReferrerEntityData(location.state)}
        entityTypeTranslationKeys={{ [STAFF_NOTES_ENTITY_TYPE]: 'ui-requests-mediated.notes.entityType.request' }}
        paneHeaderAppIcon={APP_ICON_NAME}
        paneTitle={<FormattedMessage id="ui-requests-mediated.notes.newStaffNote" />}
        domain={STAFF_NOTES_DOMAIN_NAME}
        navigateBack={history.goBack}
        renderReferredRecord={getReferredRecord}
      />
    );
  }

  return <Redirect to={getMediatedRequestsActivitiesUrl()} />;
};

NoteCreator.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default NoteCreator;
