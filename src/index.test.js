import { useLocation } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import {
  TitleManager,
  Route,
} from '@folio/stripes/core';

import RequestsMediated from './index';
import RequestFormContainer from './components/MediatedRequestsActivities/components/RequestFormContainer';
import MediatedRequestsActivitiesContainer from './routes/MediatedRequestsActivitiesContainer';
import MediatedRequestsDetail from './components/MediatedRequestsActivities/components/MediatedRequestsDetail';
import {
  CONFIRM_ITEM_ARRIVAL,
  MEDIATED_REQUESTS_ACTIVITIES,
  SEND_ITEM_IN_TRANSIT,
} from './constants';

const settings = {
  settings: {},
};
const patronGroups = {
  patronGroups: {
    usergroups: [],
  },
};
const location = {
  search: '?query=test',
};
const labelIds = {
  searchTitle: 'ui-requests-mediated.meta.searchTitle',
  metaTitle: 'ui-requests-mediated.meta.title',
};
const basicProps = {
  match: {
    path: 'path',
  },
  showSettings: true,
};

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => location),
}));
jest.mock('./hooks', () => ({
  useGeneralTlrSettings: jest.fn(() => settings),
  usePatronGroups: jest.fn(() => patronGroups),
}));
jest.mock('./components/ConfirmItemArrival', () => jest.fn(() => <div />));
jest.mock('./routes/MediatedRequestsActivitiesContainer', () => jest.fn(({ children }) => (
  <div>
    {children}
  </div>
)));
jest.mock('./components/MediatedRequestsActivities/components/MediatedRequestsDetail', () => jest.fn(() => <div />));
jest.mock('./components/SendItemInTransit', () => jest.fn(() => <div />));
jest.mock('./components/MediatedRequestsActivities/components/RequestFormContainer', () => jest.fn(() => <div />));

describe('RequestsMediated', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial render', () => {
    beforeEach(() => {
      render(<RequestsMediated {...basicProps} />);
    });

    it('should trigger TitleManager with correct props', () => {
      const expectedProps = {
        page: labelIds.searchTitle,
      };

      expect(TitleManager).toHaveBeenCalledWith(expectedProps, {});
    });

    it('should trigger RequestFormContainer twice with correct props', () => {
      const expectedProps = [
        {
          isEditMode: false,
          patronGroups: patronGroups.patronGroups.usergroups,
          settings: settings.settings,
        },
        {
          isEditMode: true,
          patronGroups: patronGroups.patronGroups.usergroups,
          settings: settings.settings,
          request: null,
          setRequest: expect.any(Function),
        }
      ];

      expectedProps.forEach(props => {
        expect(RequestFormContainer).toHaveBeenCalledWith(props, {});
      });
    });

    it('should trigger Routes with correct paths', () => {
      const rootPath = basicProps.match.path;
      const paths = [
        `${rootPath}/${MEDIATED_REQUESTS_ACTIVITIES}/create`,
        `${rootPath}/${MEDIATED_REQUESTS_ACTIVITIES}/edit/:id`,
        `${rootPath}/${MEDIATED_REQUESTS_ACTIVITIES}/preview/:id`,
        `${rootPath}/${MEDIATED_REQUESTS_ACTIVITIES}/notes/new`,
        `${rootPath}/${MEDIATED_REQUESTS_ACTIVITIES}/notes/:noteId/edit`,
        `${rootPath}/${MEDIATED_REQUESTS_ACTIVITIES}/notes/:noteId`,
        `${rootPath}/${MEDIATED_REQUESTS_ACTIVITIES}`,
        `${rootPath}/${CONFIRM_ITEM_ARRIVAL}`,
        `${rootPath}/${SEND_ITEM_IN_TRANSIT}`,
      ];

      paths.forEach(path => {
        expect(Route).toHaveBeenCalledWith(expect.objectContaining({ path }), {});
      });
    });

    it('should trigger MediatedRequestsActivitiesContainer with correct props', () => {
      const expectedProps = {
        ...basicProps,
        settings: settings.settings,
      };

      expect(MediatedRequestsActivitiesContainer).toHaveBeenCalledWith(expectedProps, {});
    });

    it('should trigger MediatedRequestsDetail with correct props', () => {
      const expectedProps = {
        ...basicProps,
        setRequest: expect.any(Function),
        patronGroups: patronGroups.patronGroups.usergroups,
      };

      expect(MediatedRequestsDetail).toHaveBeenCalledWith(expectedProps, {});
    });
  });

  describe('When search query is not provided', () => {
    beforeEach(() => {
      useLocation.mockReturnValueOnce({
        search: '',
      });
      render(<RequestsMediated {...basicProps} />);
    });

    it('should trigger TitleManager with correct props', () => {
      const expectedProps = {
        page: labelIds.metaTitle,
      };

      expect(TitleManager).toHaveBeenCalledWith(expectedProps, {});
    });
  });
});
