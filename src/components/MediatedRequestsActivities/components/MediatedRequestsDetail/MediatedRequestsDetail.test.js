import { useHistory } from 'react-router-dom';

import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { NotesSmartAccordion } from '@folio/stripes/smart-components';
import { TitleManager } from '@folio/stripes/core';

import MediatedRequestsDetail, {
  isEditAndConfirmButtonVisible,
} from './MediatedRequestsDetail';
import TitleInformation from '../TitleInformation';
import MediatedRequestInformation from '../MediatedRequestInformation';
import ItemDetail from '../ItemDetail';
import UserDetail from '../UserDetail';
import { useMediatedRequestById } from '../../../../hooks';
import { getPatronGroup } from '../../../../utils';
import {
  getMediatedRequestsActivitiesUrl,
  MEDIATED_REQUEST_STATUS,
  MEDIATED_REQUEST_LEVEL,
  MEDIATED_REQUEST_TYPES,
  STAFF_NOTES_DOMAIN_NAME,
  STAFF_NOTES_ENTITY_TYPE,
} from '../../../../constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ pathname: '/id' })),
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
  editAndConfirmButton: 'ui-requests-mediated.mediatedRequestDetails.actionMenu.editAndConfirm',
};

describe('MediatedRequestsDetail', () => {
  const props = {
    stripes: {
      hasPerm: jest.fn(),
    },
    patronGroups: [],
    setRequest: jest.fn(),
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
    requestType: MEDIATED_REQUEST_TYPES.HOLD,
    requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
    patronComments: '',
    proxy: {},
  };
  const patronGroup = {
    group: 'group',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    getPatronGroup.mockReturnValueOnce(patronGroup);
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

      render(
        <MediatedRequestsDetail
          {...props}
        />
      );
    });

    it('should trigger TitleManager with correct props', () => {
      const expectedProps = {
        record: mediatedRequest.instance.title,
      };

      expect(TitleManager).toHaveBeenCalledWith(expectedProps, {});
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
        confirmedRequestId: mediatedRequest.confirmedRequestId,
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
        proxy: mediatedRequest.proxy,
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

  describe('isEditAndConfirmButtonVisible', () => {
    it('should return true when user has view-confirm and view-create-edit', () => {
      const stripes = {
        hasPerm: (currentPerm) => {
          const hasPerm = {
            'ui-requests-mediated.requests-mediated.view-confirm.execute': true,
            'ui-requests-mediated.requests-mediated.view-create-edit.execute': true,
          };

          return hasPerm[currentPerm];
        },
      };

      expect(isEditAndConfirmButtonVisible(stripes)).toBe(true);
    });

    it('should return true when user has view-confirm', () => {
      const stripes = {
        hasPerm: (currentPerm) => {
          const hasPerm = {
            'ui-requests-mediated.requests-mediated.view-confirm.execute': true,
            'ui-requests-mediated.requests-mediated.view-create-edit.execute': false,
          };

          return hasPerm[currentPerm];
        },
      };

      expect(isEditAndConfirmButtonVisible(stripes)).toBe(true);
    });

    it('should return true when user has view-create-edit', () => {
      const stripes = {
        hasPerm: (currentPerm) => {
          const hasPerm = {
            'ui-requests-mediated.requests-mediated.view-confirm.execute': false,
            'ui-requests-mediated.requests-mediated.view-create-edit.execute': true,
          };

          return hasPerm[currentPerm];
        },
      };

      expect(isEditAndConfirmButtonVisible(stripes)).toBe(true);
    });

    it('should return false when user does not have view-confirm and view-create-edit', () => {
      const stripes = {
        hasPerm: (currentPerm) => {
          const hasPerm = {
            'ui-requests-mediated.requests-mediated.view-confirm.execute': false,
            'ui-requests-mediated.requests-mediated.view-create-edit.execute': false,
          };

          return hasPerm[currentPerm];
        },
      };

      expect(isEditAndConfirmButtonVisible(stripes)).toBe(false);
    });
  });

  describe('Action menu', () => {
    const push = jest.fn();

    beforeEach(() => {
      props.stripes.hasPerm.mockReturnValue(true);
      useHistory.mockReturnValue({ push });
      useMediatedRequestById.mockReturnValueOnce({ mediatedRequest });

      render(
        <MediatedRequestsDetail
          {...props}
        />
      );
    });

    it('should render "Edit and Confirm" button', () => {
      const editAndConfirmButton = screen.getByText(labelIds.editAndConfirmButton);

      expect(editAndConfirmButton).toBeInTheDocument();
    });

    it('should redirect on edit mediated request page', () => {
      const editAndConfirmButton = screen.getByText(labelIds.editAndConfirmButton);

      fireEvent.click(editAndConfirmButton);

      expect(push).toHaveBeenCalledWith(`${getMediatedRequestsActivitiesUrl()}/edit/id`);
    });
  });
});
