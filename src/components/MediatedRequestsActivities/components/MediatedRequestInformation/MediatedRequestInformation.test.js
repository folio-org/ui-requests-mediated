import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { ViewMetaData } from '@folio/stripes/smart-components';

import MediatedRequestInformation from './MediatedRequestInformation';
import {
  REQUEST_LEVEL_TYPES,
  REQUEST_STATUSES,
  REQUEST_STATUSES_TRANSLATIONS,
  REQUEST_TYPE_TRANSLATIONS,
  REQUEST_TYPES,
} from '../../../../constants';

jest.mock('react-router-dom', () => ({
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

const basicProps = {
  requestId: 'requestId',
  metadata: {
    createdDate: 'createdDate',
  },
  requestType: REQUEST_TYPES.RECALL,
  requestStatus: REQUEST_STATUSES.AWAITING_DELIVERY,
  requestLevel: REQUEST_LEVEL_TYPES.TITLE,
  patronComments: 'patronComments',
};
const labelIds = {
  requestType: 'ui-requests-mediated.mediatedRequestInformation.requestType',
  status: 'ui-requests-mediated.mediatedRequestInformation.status',
  level: 'ui-requests-mediated.mediatedRequestInformation.level',
  titleRequest: 'ui-requests-mediated.mediatedRequestInformation.level.title',
  confirmedRequest: 'ui-requests-mediated.mediatedRequestInformation.confirmedRequest',
  viewDetailsLink: 'ui-requests-mediated.mediatedRequestInformation.viewDetails',
  patronComments: 'ui-requests-mediated.mediatedRequestInformation.patronComments',
};

describe('MediatedRequestInformation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When metadata is provided', () => {
    beforeEach(() => {
      render(
        <MediatedRequestInformation
          {...basicProps}
        />
      );
    });

    it('should trigger ViewMetaData with correct props', () => {
      const expectedProps = {
        metadata: basicProps.metadata,
      };

      expect(ViewMetaData).toHaveBeenCalledWith(expectedProps, {});
    });

    it('should render request type label', () => {
      const requestTypeLabel = screen.getByText(labelIds.requestType);

      expect(requestTypeLabel).toBeInTheDocument();
    });

    it('should render request type value', () => {
      const requestTypeValue = screen.getByText(REQUEST_TYPE_TRANSLATIONS[basicProps.requestType]);

      expect(requestTypeValue).toBeInTheDocument();
    });

    it('should render status label', () => {
      const statusLabel = screen.getByText(labelIds.status);

      expect(statusLabel).toBeInTheDocument();
    });

    it('should render status value', () => {
      const requestStatusValue = screen.getByText(REQUEST_STATUSES_TRANSLATIONS[basicProps.requestStatus]);

      expect(requestStatusValue).toBeInTheDocument();
    });

    it('should render request level label', () => {
      const requestLevelLabel = screen.getByText(labelIds.level);

      expect(requestLevelLabel).toBeInTheDocument();
    });

    it('should render request level value', () => {
      const requestLevelValue = screen.getByText(labelIds.titleRequest);

      expect(requestLevelValue).toBeInTheDocument();
    });

    it('should render confirmed request label', () => {
      const confirmedRequestLabel = screen.getByText(labelIds.confirmedRequest);

      expect(confirmedRequestLabel).toBeInTheDocument();
    });

    it('should render confirmed request value', () => {
      const confirmedRequestValue = screen.getByText(labelIds.viewDetailsLink);

      expect(confirmedRequestValue).toBeInTheDocument();
    });

    it('should render patron comments label', () => {
      const patronCommentsLabel = screen.getByText(labelIds.patronComments);

      expect(patronCommentsLabel).toBeInTheDocument();
    });

    it('should render patron comments value', () => {
      const patronCommentsValue = screen.getByText(basicProps.patronComments);

      expect(patronCommentsValue).toBeInTheDocument();
    });
  });

  describe('When metadata is not provided', () => {
    const props = {
      ...basicProps,
      metadata: undefined,
    };

    beforeEach(() => {
      render(
        <MediatedRequestInformation
          {...props}
        />
      );
    });

    it('should not trigger ViewMetaData', () => {
      expect(ViewMetaData).not.toHaveBeenCalled();
    });
  });
});
