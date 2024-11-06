import { useState } from 'react';

import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { Select } from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import RequestInformation from './RequestInformation';
import { getNoRequestTypeErrorMessageId } from '../../../../utils';
import {
  MEDIATED_REQUEST_STATUS,
  MEDIATED_REQUEST_TYPE_ERROR_LEVEL,
  MEDIATED_REQUEST_TYPE_ERROR_TRANSLATIONS,
  MEDIATED_REQUEST_TYPE_TRANSLATION_KEYS,
  MEDIATED_REQUEST_TYPES,
} from '../../../../constants';

jest.mock('../../../../utils', () => ({
  getNoRequestTypeErrorMessageId: jest.fn(),
}));

const labelIds = {
  requestTypeLabel: 'ui-requests-mediated.form.request.requestType',
  selectRequestType: 'ui-requests-mediated.form.request.selectRequestType',
  titleLevelRequestError: 'ui-requests-mediated.form.errors.requestType.titleLevelRequest',
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

  describe('Validation', () => {
    beforeEach(() => {
      Select.mockImplementation(jest.fn(({
        validate,
        onChange,
        ...rest
      }) => {
        const [error, setError] = useState('');
        const handleChange = (e) => {
          setError(validate(e.target.value));
          onChange(e);
        };

        return (
          <div>
            <select
              onChange={handleChange}
              {...rest}
            >
              <option value="test">test</option>
            </select>
            <span data-testid="errorMessage">{error}</span>
          </div>
        );
      }));

      getNoRequestTypeErrorMessageId.mockReturnValue(MEDIATED_REQUEST_TYPE_ERROR_TRANSLATIONS[MEDIATED_REQUEST_TYPE_ERROR_LEVEL.TITLE_LEVEL_ERROR]);
    });

    it('should render title lever request type error', () => {
      render(
        <RequestInformation
          {...basicProps}
        />
      );

      const event = {
        target: {
          value: 'test',
        },
      };
      const requestTypeSelect = screen.getByTestId(testIds.requestTypeDropDown);
      const errorMessage = screen.getByTestId(testIds.errorMessage);

      fireEvent.change(requestTypeSelect, event);

      expect(errorMessage).toHaveTextContent(labelIds.titleLevelRequestError);
    });

    it('should not render request type error', () => {
      const props = {
        ...basicProps,
        requestTypeOptions: [{
          id: 'id',
          value: 'value',
        }],
      };

      render(
        <RequestInformation
          {...props}
        />
      );

      const event = {
        target: {
          value: 'test',
        },
      };
      const requestTypeSelect = screen.getByTestId(testIds.requestTypeDropDown);
      const errorMessage = screen.getByTestId(testIds.errorMessage);

      fireEvent.change(requestTypeSelect, event);

      expect(errorMessage).toBeEmpty();
    });

    it('should not render request type error when user is not selected', () => {
      const props = {
        ...basicProps,
        isSelectedUser: false,
        requestTypeOptions: [{
          id: 'id',
          value: 'value',
        }],
      };

      render(
        <RequestInformation
          {...props}
        />
      );

      const event = {
        target: {
          value: 'test',
        },
      };
      const requestTypeSelect = screen.getByTestId(testIds.requestTypeDropDown);
      const errorMessage = screen.getByTestId(testIds.errorMessage);

      fireEvent.change(requestTypeSelect, event);

      expect(errorMessage).toBeEmpty();
    });
  });
});
