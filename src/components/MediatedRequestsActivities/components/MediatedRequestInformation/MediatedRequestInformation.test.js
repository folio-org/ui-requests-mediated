import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { ViewMetaData } from '@folio/stripes/smart-components';

import MediatedRequestInformation from './MediatedRequestInformation';
import {
  MEDIATED_REQUEST_LEVEL,
  MEDIATED_REQUEST_STATUS,
  MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS,
  MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS,
  MEDIATED_REQUEST_TYPES,
} from '../../../../constants';

jest.mock('react-router-dom', () => ({
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

const basicProps = {
  confirmedRequestId: 'confirmedRequestId',
  metadata: {
    createdDate: 'createdDate',
  },
  requestType: MEDIATED_REQUEST_TYPES.RECALL,
  requestStatus: MEDIATED_REQUEST_STATUS.OPEN_AWAITING_PICKUP,
  requestLevel: MEDIATED_REQUEST_LEVEL.TITLE,
  patronComments: 'patronComments',
};
const labelIds = {
  requestType: 'ui-requests-mediated.mediatedRequestInformation.requestType',
  status: 'ui-requests-mediated.mediatedRequestInformation.status',
  level: 'ui-requests-mediated.mediatedRequestInformation.level',
  titleRequest: 'ui-requests-mediated.mediatedRequestInformation.level.title',
  confirmedRequest: 'ui-requests-mediated.mediatedRequestInformation.confirmedRequest',
  viewDetailsLink: 'ui-requests-mediated.mediatedRequestInformation.viewDetailsLink',
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
      const requestTypeValue = screen.getByText(MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS[basicProps.requestType]);

      expect(requestTypeValue).toBeInTheDocument();
    });

    it('should render status label', () => {
      const statusLabel = screen.getByText(labelIds.status);

      expect(statusLabel).toBeInTheDocument();
    });

    it('should render status value', () => {
      const requestStatusValue = screen.getByText(MEDIATED_REQUEST_STATUS_TRANSLATION_KEYS[basicProps.requestStatus]);

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
