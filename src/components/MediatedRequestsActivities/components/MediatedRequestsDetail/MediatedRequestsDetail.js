import {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  get,
} from 'lodash';

import {
  IfPermission,
  TitleManager,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  Button,
  Icon,
  Pane,
  Accordion,
  AccordionSet,
  AccordionStatus,
  Loading,
  Layout,
} from '@folio/stripes/components';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import TitleInformation from '../TitleInformation';
import MediatedRequestInformation from '../MediatedRequestInformation';
import ItemDetail from '../ItemDetail';
import UserDetail from '../UserDetail';
import DeclineModal from './components/DeclineModal';
import {
  useMediatedRequestById,
  useUserById,
  useServicePoints,
} from '../../../../hooks';
import {
  DEFAULT_VIEW_VALUE,
  ICONS,
  MEDIATED_REQUEST_STATUS,
  MEDIATED_REQUESTS_ACTIVITIES,
  MEDIATED_REQUESTS_RECORD_FIELD_NAME,
  MEDIATED_REQUESTS_RECORD_FIELD_PATH,
  MODULE_ROUTE,
  STAFF_NOTES_DOMAIN_NAME,
  STAFF_NOTES_ENTITY_TYPE,
  getMediatedRequestsActivitiesUrl,
} from '../../../../constants';
import {
  getPatronGroup,
  getUserPreferences,
  getReferredRecordData,
  confirmDeclineModal,
} from '../../../../utils';

const DETAIL_PANE_WIDTH = '44%';

export const isEditAndConfirmButtonVisible = (stripes) => (
  stripes.hasPerm('ui-requests-mediated.requests-mediated.view-confirm.execute') || stripes.hasPerm('ui-requests-mediated.requests-mediated.view-create-edit.execute')
);

const MediatedRequestsDetail = ({
  stripes,
  patronGroups,
  setRequest,
  updateMediatedRequestList,
}) => {
  const history = useHistory();
  const location = useLocation();
  const ky = useOkapiKy();
  const mediatedRequestIdFromPathname = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

  const { formatMessage } = useIntl();
  const {
    mediatedRequest,
    isFetching,
    shouldUpdateMediatedRequestById,
    setShouldUpdateMediatedRequestById,
  } = useMediatedRequestById(mediatedRequestIdFromPathname);
  const { userData } = useUserById(mediatedRequest?.requesterId, isFetching);
  const { servicePoints } = useServicePoints();
  const mediatedRequestsActivitiesUrl = getMediatedRequestsActivitiesUrl();

  setRequest(mediatedRequest);

  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const onOpenDeclineModal = () => setDeclineModalOpen(true);
  const declineModalState = {
    shouldUpdateMediatedRequestById,
    setShouldUpdateMediatedRequestById,
    setDeclineModalOpen,
  };
  const declineModalProps = {
    ky,
    url: `requests-mediated/mediated-requests/${mediatedRequestIdFromPathname}/decline`,
    updateMediatedRequestList,
  };
  const onConfirmDeclineModal = () => confirmDeclineModal(declineModalState, declineModalProps);
  const onCloseDeclineModal = () => setDeclineModalOpen(false);
  const isActionMenuVisible = () => (
    get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.STATUS], DEFAULT_VIEW_VALUE) === MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION
      ? stripes.hasPerm('ui-requests-mediated.requests-mediated.view-confirm.execute') || stripes.hasPerm('ui-requests-mediated.requests-mediated.view-create-edit.execute') || stripes.hasPerm('ui-requests-mediated.requests-mediated.view-decline.execute')
      : false
  );
  const showActionMenu = isActionMenuVisible();

  const onClose = () => {
    history.push(`/${MODULE_ROUTE}/${MEDIATED_REQUESTS_ACTIVITIES}${location.search}`);
  };

  const actionMenu = ({ onToggle }) => {
    const handleEditAndConfirm = () => {
      onToggle();
      history.push(`${mediatedRequestsActivitiesUrl}/edit/${mediatedRequestIdFromPathname}`);
    };
    const handleDecline = () => {
      onOpenDeclineModal();
      onToggle();
    };

    return (
      <>
        {isEditAndConfirmButtonVisible(stripes) &&
          <Button
            buttonStyle="dropdownItem"
            marginBottom0
            onClick={handleEditAndConfirm}
          >
            <Icon icon={ICONS.EDIT}>
              <FormattedMessage id="ui-requests-mediated.mediatedRequestDetails.actionMenu.editAndConfirm" />
            </Icon>
          </Button>
        }
        <IfPermission perm="ui-requests-mediated.requests-mediated.view-decline.execute">
          <Button
            buttonStyle="dropdownItem"
            marginBottom0
            onClick={handleDecline}
          >
            <Icon icon={ICONS.TIMES_CIRCLE}>
              <FormattedMessage id="ui-requests-mediated.mediatedRequestDetails.actionMenu.decline" />
            </Icon>
          </Button>
        </IfPermission>
      </>
    );
  };

  const patronGroup = getPatronGroup(mediatedRequest?.requester, patronGroups);
  const userPreferences = getUserPreferences(mediatedRequest, userData, servicePoints);
  const referredRecordData = getReferredRecordData(mediatedRequest);

  return (
    <Pane
      id="mediatedRequestsDetailPane"
      data-testid="mediatedRequestsDetailPane"
      defaultWidth={DETAIL_PANE_WIDTH}
      paneTitle={formatMessage({ id:'ui-requests-mediated.mediatedRequestDetails.paneTitle' })}
      dismissible
      onClose={onClose}
      {... (showActionMenu ? { actionMenu } : {})}
    >
      {
        isFetching ?
          <Layout
            data-testid="loading"
            className="display-flex centerContent"
          >
            <Loading size="large" />
          </Layout> :
          mediatedRequest?.id &&
            <>
              <TitleManager record={get(mediatedRequest, ['instance', 'title'])} />
              <AccordionStatus>
                <AccordionSet>
                  <Accordion
                    id="titleInformationAccordion"
                    label={<FormattedMessage id="ui-requests-mediated.mediatedRequestDetail.title.accordionLabel" />}
                  >
                    <TitleInformation
                      instanceId={mediatedRequest.instanceId}
                      title={mediatedRequest.instance.title}
                      contributors={mediatedRequest.instance.contributorNames}
                      publications={mediatedRequest.instance.publication}
                      editions={mediatedRequest.instance.editions}
                      identifiers={mediatedRequest.instance.identifiers}
                    />
                  </Accordion>
                  <Accordion
                    id="itemInformationAccordion"
                    label={<FormattedMessage id="ui-requests-mediated.mediatedRequestDetail.item.accordionLabel" />}
                  >
                    {
                      mediatedRequest?.item ?
                        <ItemDetail
                          request={mediatedRequest}
                          item={mediatedRequest.item}
                          loan={mediatedRequest.loan}
                        /> :
                        <FormattedMessage id="ui-requests-mediated.mediatedRequestDetail.item.noInformation" />
                    }
                  </Accordion>
                </AccordionSet>
                <Accordion
                  id="mediatedRequestInformationAccordion"
                  label={<FormattedMessage id="ui-requests-mediated.mediatedRequestDetail.mediatedRequest.accordionLabel" />}
                >
                  <MediatedRequestInformation
                    confirmedRequestId={mediatedRequest.confirmedRequestId}
                    metadata={mediatedRequest.metadata}
                    requestType={mediatedRequest.requestType}
                    requestStatus={mediatedRequest.status}
                    requestLevel={mediatedRequest.requestLevel}
                    patronComments={mediatedRequest.patronComments}
                  />
                </Accordion>
                <Accordion
                  id="requesterInformationAccordion"
                  label={<FormattedMessage id="ui-requests-mediated.mediatedRequestDetail.requester.accordionLabel" />}
                >
                  <UserDetail
                    user={mediatedRequest.requester}
                    patronGroup={patronGroup?.group}
                    request={mediatedRequest}
                    userPreferences={userPreferences}
                    proxy={mediatedRequest.proxy}
                  />
                </Accordion>
                <NotesSmartAccordion
                  id="staffNotes"
                  domainName={STAFF_NOTES_DOMAIN_NAME}
                  entityId={mediatedRequest.id}
                  entityName={mediatedRequest.instance.title}
                  entityType={STAFF_NOTES_ENTITY_TYPE}
                  referredRecordData={referredRecordData}
                  label={<FormattedMessage id="ui-requests-mediated.notes.staffNotes" />}
                  pathToNoteCreate={`${mediatedRequestsActivitiesUrl}/notes/new`}
                  pathToNoteDetails={`${mediatedRequestsActivitiesUrl}/notes`}
                  hideAssignButton
                />
              </AccordionStatus>
              <DeclineModal
                open={declineModalOpen}
                title={get(mediatedRequest, MEDIATED_REQUESTS_RECORD_FIELD_PATH[MEDIATED_REQUESTS_RECORD_FIELD_NAME.TITLE], DEFAULT_VIEW_VALUE)}
                onConfirm={onConfirmDeclineModal}
                onClose={onCloseDeclineModal}
              />
            </>
      }
    </Pane>
  );
};

MediatedRequestsDetail.propTypes = {
  stripes: PropTypes.object.isRequired,
  setRequest: PropTypes.func.isRequired,
  updateMediatedRequestList: PropTypes.func.isRequired,
  patronGroups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    group: PropTypes.string,
  })).isRequired,
};

export default MediatedRequestsDetail;
