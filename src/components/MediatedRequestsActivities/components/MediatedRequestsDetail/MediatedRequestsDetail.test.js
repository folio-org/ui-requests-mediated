import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';

import MediatedRequestsDetail from './MediatedRequestsDetail';
import TitleInformation from '../TitleInformation';
import MediatedRequestInformation from '../MediatedRequestInformation';
import ItemDetail from '../ItemDetail';
import UserDetail from '../UserDetail';
import { useMediatedRequestById } from '../../../../hooks';
import { getPatronGroup } from '../../../../utils';
import {
  getMediatedRequestsActivitiesUrl,
  MEDIATED_REQUEST_STATUS,
  REQUEST_LEVEL_TYPES,
  REQUEST_TYPES,
  STAFF_NOTES_DOMAIN_NAME,
  STAFF_NOTES_ENTITY_TYPE,
} from '../../../../constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ pathname: '' })),
  useHistory: jest.fn(),
}));
jest.mock('../../../../hooks', () => ({
  useMediatedRequestById: jest.fn(() => ({ mediatedRequest: null })),
  useUserById: jest.fn(() => ({})),
  useServicePoints: jest.fn(() => ({})),
}));
jest.mock('../../../../utils', () => ({
  getPatronGroup: jest.fn(),
  getUserPreferences: jest.fn(() => ({})),
  getReferredRecordData: jest.fn(() => ({})),
}));
jest.mock('../TitleInformation', () => jest.fn(() => <div />));
jest.mock('../MediatedRequestInformation', () => jest.fn(() => <div />));
jest.mock('../ItemDetail', () => jest.fn(() => <div />));
jest.mock('../UserDetail', () => jest.fn(() => <div />));

const testIds = {
  mediatedRequestsDetailPane: 'mediatedRequestsDetailPane',
  loading: 'loading',
};
const labelIds = {
  titleAccordion: 'ui-requests-mediated.mediatedRequestDetail.title.accordionLabel',
  itemAccordion: 'ui-requests-mediated.mediatedRequestDetail.item.accordionLabel',
  mediatedRequestAccordion: 'ui-requests-mediated.mediatedRequestDetail.mediatedRequest.accordionLabel',
  requesterAccordion: 'ui-requests-mediated.mediatedRequestDetail.requester.accordionLabel',
  noItemInformation: 'ui-requests-mediated.mediatedRequestDetail.item.noInformation',
};

describe('MediatedRequestsDetail', () => {
  const props = {
    stripes: {
      hasPerm: jest.fn(),
    },
    patronGroups: [],
  };
  const mediatedRequest = {
    requesterId: 'requesterId',
    status: MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION,
    requester: {},
    instanceId: 'instanceId',
    instance: {
      title: 'title',
      contributorNames: [],
      publication: [],
      editions: [],
      identifiers: [],
    },
    item: {},
    loan: {},
    id: 'id',
    metadata: {},
    requestType: REQUEST_TYPES.HOLD,
    requestLevel: REQUEST_LEVEL_TYPES.TITLE,
    patronComments: '',
  };
  const patronGroup = {
    group: 'group',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When data is loading', () => {
    beforeEach(() => {
      useMediatedRequestById.mockReturnValueOnce({ isFetching: true });

      render(
        <MediatedRequestsDetail
          {...props}
        />
      );
    });

    it('should render pane', () => {
      expect(screen.getByTestId(testIds.mediatedRequestsDetailPane)).toBeInTheDocument();
    });

    it('should render loader', () => {
      expect(screen.getByTestId(testIds.loading)).toBeInTheDocument();
    });
  });

  describe('When data is loaded', () => {
    beforeEach(() => {
      useMediatedRequestById.mockReturnValueOnce({
        isFetching: false,
        mediatedRequest,
      });
      getPatronGroup.mockReturnValueOnce(patronGroup);

      render(
        <MediatedRequestsDetail
          {...props}
        />
      );
    });

    it('should render title accordion label', () => {
      const titleAccordion = screen.getByText(labelIds.titleAccordion);

      expect(titleAccordion).toBeInTheDocument();
    });

    it('should render item accordion label', () => {
      const itemAccordion = screen.getByText(labelIds.itemAccordion);

      expect(itemAccordion).toBeInTheDocument();
    });

    it('should render mediated request accordion label', () => {
      const mediatedRequestAccordion = screen.getByText(labelIds.mediatedRequestAccordion);

      expect(mediatedRequestAccordion).toBeInTheDocument();
    });

    it('should render requester accordion label', () => {
      const requesterAccordion = screen.getByText(labelIds.requesterAccordion);

      expect(requesterAccordion).toBeInTheDocument();
    });

    it('should trigger TitleInformation with correct props', () => {
      const expectedProps = {
        instanceId: mediatedRequest.instanceId,
        title: mediatedRequest.instance.title,
        contributors: mediatedRequest.instance.contributorNames,
        publications: mediatedRequest.instance.publication,
        editions: mediatedRequest.instance.editions,
        identifiers: mediatedRequest.instance.identifiers,
      };

      expect(TitleInformation).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should trigger ItemDetail with correct props', () => {
      const expectedProps = {
        request: mediatedRequest,
        item: mediatedRequest.item,
        loan: mediatedRequest.loan,
      };

      expect(ItemDetail).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should trigger MediatedRequestInformation with correct props', () => {
      const expectedProps = {
        requestId: mediatedRequest.id,
        metadata: mediatedRequest.metadata,
        requestType: mediatedRequest.requestType,
        requestStatus: mediatedRequest.status,
        requestLevel: mediatedRequest.requestLevel,
        patronComments: mediatedRequest.patronComments,
      };

      expect(MediatedRequestInformation).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should trigger UserDetail with correct props', () => {
      const expectedProps = {
        user: mediatedRequest.requester,
        patronGroup: patronGroup.group,
        request: mediatedRequest,
        userPreferences: {},
        isMediatedRequestDetailPage: true,
      };

      expect(UserDetail).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should trigger NotesSmartAccordion with correct props', () => {
      const mediatedRequestsActivitiesUrl = getMediatedRequestsActivitiesUrl();
      const expectedProps = {
        id: 'staffNotes',
        domainName: STAFF_NOTES_DOMAIN_NAME,
        entityId: mediatedRequest.id,
        entityName: mediatedRequest.instance.title,
        entityType: STAFF_NOTES_ENTITY_TYPE,
        pathToNoteCreate: `${mediatedRequestsActivitiesUrl}/notes/new`,
        pathToNoteDetails: `${mediatedRequestsActivitiesUrl}/notes`,
        hideAssignButton: true,
      };

      expect(NotesSmartAccordion).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('When no item information', () => {
    beforeEach(() => {
      useMediatedRequestById.mockReturnValueOnce({
        isFetching: false,
        mediatedRequest: {
          ...mediatedRequest,
          item: null,
        },
      });
      getPatronGroup.mockReturnValueOnce(patronGroup);

      render(
        <MediatedRequestsDetail
          {...props}
        />
      );
    });

    it('should not trigger ItemDetail', () => {
      expect(ItemDetail).not.toHaveBeenCalled();
    });

    it('should render no item information message', () => {
      const noItemInfoMessage = screen.getByText(labelIds.noItemInformation);

      expect(noItemInfoMessage).toBeInTheDocument();
    });
  });
});
