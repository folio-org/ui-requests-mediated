import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { ViewMetaData } from '@folio/stripes/smart-components';

import RequestInformation from './RequestInformation';
import {
  MEDIATED_REQUEST_STATUS,
  MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS,
  MEDIATED_REQUEST_TYPES,
} from '../../../../constants';

const labelIds = {
  requestTypeLabel: 'ui-requests-mediated.form.request.requestType',
  selectRequestType: 'ui-requests-mediated.form.request.selectRequestType',
  requiredToConfirm: 'ui-requests-mediated.form.errors.requiredToConfirm',
  requestStatus: 'ui-requests-mediated.form.request.status',
  patronComment: 'ui-requests-mediated.form.request.patronComments',
};
const testIds = {
  requestTypeDropDown: 'requestTypeDropDown',
  errorMessage: 'errorMessage',
  metadataDisplay: 'metadataDisplay,'
};
const basicProps = {
  isTitleLevelRequest: true,
  isSelectedInstance: true,
  isSelectedItem: false,
  isSelectedUser: true,
  isRequestTypesReceived: true,
  isRequestTypeLoading: false,
  requestTypeOptions: [],
  values: {
    keyOfRequestTypeField: 1,
  },
  isEditMode: false,
};

describe('RequestInformation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Request creation', () => {
    beforeEach(() => {
      render(
        <RequestInformation
          {...basicProps}
        />
      );
    });

    it('should render request type dropdown', () => {
      const requestTypeDropDown = screen.getByTestId(testIds.requestTypeDropDown);

      expect(requestTypeDropDown).toBeInTheDocument();
    });

    it('should render request type label', () => {
      const requestTypeLabel = screen.getByText(labelIds.requestTypeLabel);

      expect(requestTypeLabel).toBeInTheDocument();
    });

    it('should render request type default value', () => {
      const selectRequestType = screen.getByText(labelIds.selectRequestType);

      expect(selectRequestType).toBeInTheDocument();
    });

    it('should render patron comments label', () => {
      const patronCommentLabel = screen.getByText(labelIds.patronComment);

      expect(patronCommentLabel).toBeInTheDocument();
    });
  });

  describe('Request editing', () => {
    const props = {
      ...basicProps,
      isEditMode: true,
      request: {
        status: MEDIATED_REQUEST_STATUS.NEW_AWAITING_CONFIRMATION,
        patronComments: 'comments',
        id: 'id',
        metadata: {},
      },
    };

    beforeEach(() => {
      render(
        <RequestInformation
          {...props}
        />
      );
    });

    it('should render request status label', () => {
      const requestStatusLabel = screen.getByText(labelIds.requestStatus);

      expect(requestStatusLabel).toBeInTheDocument();
    });

    it('should trigger ViewMetaData with correct props', () => {
      const expectedProps = {
        metadata: props.request.metadata,
      };

      expect(ViewMetaData).toHaveBeenCalledWith(expectedProps, {});
    });
  });

  describe('When request type options are provided', () => {
    const props = {
      ...basicProps,
      requestTypeOptions: [{
        id: MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS[MEDIATED_REQUEST_TYPES.HOLD],
        value: 'value',
      }],
    };

    beforeEach(() => {
      render(
        <RequestInformation
          {...props}
        />
      );
    });

    it('should render request type option', () => {
      const requestTypeOption = screen.getByText(MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS[MEDIATED_REQUEST_TYPES.HOLD]);

      expect(requestTypeOption).toBeInTheDocument();
    });
  });
});
