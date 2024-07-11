import { useState } from 'react';
import { Field } from 'react-final-form';

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  Icon,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import RequesterInformation, {
  COLUMN_MAPPING,
  VISIBLE_COLUMNS,
} from './RequesterInformation';
import UserDetail from '../UserDetail';
import { isFormEditing } from '../../../../utils';
import {
  REQUEST_FORM_FIELD_NAMES,
  RESOURCE_KEYS,
  ENTER_EVENT_KEY,
  BASE_SPINNER_PROPS,
} from '../../../../constants';

jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  isFormEditing: jest.fn(() => false),
  memoizeValidation: (fn) => () => fn,
}));
jest.mock('../UserDetail', () => jest.fn(() => <div />));

const basicProps = {
  triggerUserBarcodeValidation: jest.fn(),
  findUser: jest.fn(() => null),
  getUserValidationData: jest.fn(() => null),
  onSetSelectedUser: jest.fn(),
  form: {
    change: jest.fn(),
  },
  values: {
    keyOfUserBarcodeField: 1,
    requester: {
      barcode: 'requesterBarcode',
    },
  },
  request: {
    id: 'requestId',
    requester: {},
  },
  selectedUser: {},
  stripes: {},
  patronGroup: {
    group: 'group',
  },
  isLoading: false,
  submitting: false,
};
const labelIds = {
  selectUser: 'ui-requests-mediated.form.errors.selectUser',
  userDoesNotExist: 'ui-requests-mediated.form.errors.userDoesNotExist',
  inputPlaceholder: 'ui-requests-mediated.form.requester.inputPlaceholder',
  inputLabel: 'ui-requests-mediated.form.requester.inputLabel',
  lookupLabel: 'ui-requests-mediated.form.requester.lookupLabel',
  enterButton: 'ui-requests-mediated.form.enterButton',
};
const testIds = {
  requesterBarcodeField: 'requesterBarcodeField',
  searchUser: 'searchUser',
  errorMessage: 'errorMessage',
};
const renderRequesterInfoWithBarcode = (onBlur) => {
  Field.mockImplementation(jest.fn(({
    children,
    'data-testid': testId,
    validate,
  }) => {
    return children({
      meta: {},
      input: {
        validate,
        'data-testid': testId,
        value: 'requesterBarcode',
        onBlur,
      },
    });
  }));

  render(
    <RequesterInformation
      {...basicProps}
    />
  );
};

describe('RequesterInformation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When creation form', () => {
    beforeEach(() => {
      render(
        <RequesterInformation
          {...basicProps}
        />
      );
    });

    it('should render input placeholder', () => {
      const inputPlaceholder = screen.getByPlaceholderText(labelIds.inputPlaceholder);

      expect(inputPlaceholder).toBeVisible();
    });

    it('should render input label', () => {
      const inputLabel = screen.getByText(labelIds.inputLabel);

      expect(inputLabel).toBeVisible();
    });

    it('should trigger Field with correct props', () => {
      const expectedProps = {
        name: REQUEST_FORM_FIELD_NAMES.REQUESTER_BARCODE,
        validate: expect.any(Function),
        validateFields: [],
      };

      expect(Field).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should find user when Enter key is pressed', () => {
      const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

      fireEvent.keyDown(requesterBarcodeField, { key: ENTER_EVENT_KEY });

      expect(basicProps.findUser).toHaveBeenCalledWith(RESOURCE_KEYS.BARCODE, basicProps.values.requester.barcode);
    });

    it('should not find user when Control key is pressed', () => {
      const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

      fireEvent.keyDown(requesterBarcodeField, { key: 'Control' });

      expect(basicProps.findUser).not.toHaveBeenCalledWith();
    });

    it('should change form values', () => {
      const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);
      const event = {
        target: {
          value: 'requesterBarcode',
        },
      };

      fireEvent.change(requesterBarcodeField, event);

      expect(basicProps.form.change).toHaveBeenCalledWith(REQUEST_FORM_FIELD_NAMES.REQUESTER_BARCODE, event.target.value);
    });

    it('should render Enter button', () => {
      const enterButton = screen.getByText(labelIds.enterButton);

      expect(enterButton).toBeVisible();
    });

    it('should set selected user', () => {
      const enterButton = screen.getByText(labelIds.enterButton);

      fireEvent.click(enterButton);

      expect(basicProps.onSetSelectedUser).toHaveBeenCalledWith(null);
    });

    it('should find user', () => {
      const enterButton = screen.getByText(labelIds.enterButton);

      fireEvent.click(enterButton);

      expect(basicProps.findUser).toHaveBeenCalledWith(RESOURCE_KEYS.BARCODE, basicProps.values.requester.barcode);
    });
  });

  describe('When editing form', () => {
    beforeEach(() => {
      isFormEditing.mockReturnValueOnce(true);
    });

    it('should trigger UserDetail with correct props', () => {
      const expectedProps = {
        user: basicProps.request.requester,
        request: basicProps.request,
        patronGroup: basicProps.patronGroup.group,
      };

      render(
        <RequesterInformation
          {...basicProps}
        />
      );

      expect(UserDetail).toHaveBeenCalledWith(expectedProps, {});
    });

    it('should trigger UserDetail with selected user', () => {
      const props = {
        ...basicProps,
        request: undefined,
        selectedUser: {
          id: 'selectedUserId',
        },
      };
      const expectedProps = {
        user: props.selectedUser,
      };

      render(
        <RequesterInformation
          {...props}
        />
      );

      expect(UserDetail).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      TextField.mockImplementation(({
        onChange,
        validate,
        ...rest
      }) => {
        const [error, setError] = useState('');
        const handleChange = async (e) => {
          setError(await validate(e.target.value));
          onChange(e);
        };

        return (
          <div>
            <input
              {...rest}
              value="test"
              onChange={handleChange}
            />
            <span data-testid={testIds.errorMessage}>{error}</span>
          </div>
        );
      });
    });

    describe('When barcode is presented', () => {
      const event = {
        target: {
          value: 'barcode',
        },
      };

      beforeEach(() => {
        render(
          <RequesterInformation
            {...basicProps}
          />
        );
      });

      it('should not render error message', async () => {
        const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

        fireEvent.change(requesterBarcodeField, event);

        await waitFor(() => {
          const errorMessage = screen.getByTestId(testIds.errorMessage);

          expect(errorMessage).toBeEmpty();
        });
      });

      it('should render "userDoesNotExist" error message', async () => {
        const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

        fireEvent.keyDown(requesterBarcodeField, { key: ENTER_EVENT_KEY });
        fireEvent.change(requesterBarcodeField, event);

        await waitFor(() => {
          const errorMessage = screen.queryByText(labelIds.userDoesNotExist);

          expect(errorMessage).toBeVisible();
        });
      });

      it('should not render error message if requester found', async () => {
        basicProps.getUserValidationData.mockReturnValue({});

        const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

        fireEvent.keyDown(requesterBarcodeField, { key: ENTER_EVENT_KEY });
        fireEvent.change(requesterBarcodeField, event);

        await waitFor(() => {
          const errorMessage = screen.getByTestId(testIds.errorMessage);

          expect(errorMessage).toBeEmpty();
        });
      });
    });

    describe('When barcode is not presented', () => {
      const event = {
        target: {
          value: '',
        },
      };

      it('should not render error message', async () => {
        const props = {
          ...basicProps,
          selectedUser: {
            id: 'selectedUserId',
          },
        };

        render(
          <RequesterInformation
            {...props}
          />
        );

        const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

        fireEvent.change(requesterBarcodeField, event);

        await waitFor(() => {
          const errorMessage = screen.getByTestId(testIds.errorMessage);

          expect(errorMessage).toBeEmpty();
        });
      });

      it('should render "selectUser" error message', async () => {
        render(
          <RequesterInformation
            {...basicProps}
          />
        );

        const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

        fireEvent.change(requesterBarcodeField, event);

        await waitFor(() => {
          const errorMessage = screen.queryByText(labelIds.selectUser);

          expect(errorMessage).toBeVisible();
        });
      });
    });
  });

  describe('handleBlur', () => {
    const onBlur = jest.fn();

    it('should trigger "input.onBlur" if requester barcode is presented', () => {
      renderRequesterInfoWithBarcode(onBlur);

      const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

      fireEvent.click(requesterBarcodeField);
      fireEvent.blur(requesterBarcodeField);

      expect(onBlur).toHaveBeenCalled();
    });

    it('should trigger "input.onBlur" if there is no requester barcode', () => {
      Field.mockImplementationOnce(({
        children,
        'data-testid': testId,
        validate,
      }) => {
        return children({
          meta: {},
          input: {
            validate,
            'data-testid': testId,
            value: '',
            onBlur,
          },
        });
      });

      render(
        <RequesterInformation
          {...basicProps}
        />
      );

      const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

      fireEvent.click(requesterBarcodeField);
      fireEvent.blur(requesterBarcodeField);

      expect(onBlur).toHaveBeenCalled();
    });

    it('should not trigger "input.onBlur" if requester barcode was validated previously', () => {
      renderRequesterInfoWithBarcode(onBlur);

      const requesterBarcodeField = screen.getByTestId(testIds.requesterBarcodeField);

      // first input focus
      fireEvent.click(requesterBarcodeField);
      fireEvent.blur(requesterBarcodeField);
      onBlur.mockClear();

      // second input focus after validation of initial value
      fireEvent.click(requesterBarcodeField);
      fireEvent.blur(requesterBarcodeField);

      expect(onBlur).not.toHaveBeenCalled();
    });
  });

  describe('Pluggable', () => {
    describe('When user is not presented', () => {
      beforeEach(() => {
        render(
          <RequesterInformation
            {...basicProps}
          />
        );
      });

      it('should render user lookup plugin label', () => {
        const lookupLabel = screen.getByText(labelIds.lookupLabel);

        expect(lookupLabel).toBeVisible();
      });

      it('should trigger "Pluggable" with correct props', () => {
        const expectedProps = {
          'aria-haspopup': 'true',
          searchButtonStyle: 'link',
          type: 'find-user',
          dataKey: 'users',
          selectUser: expect.any(Function),
          visibleColumns: VISIBLE_COLUMNS,
          columnMapping: COLUMN_MAPPING,
          disableRecordCreation: true,
          marginTop0: true,
        };

        expect(Pluggable).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
      });

      it('should not set selected user', () => {
        const searchButtonLabel = 'Search';
        const searchButton = screen.getByText(searchButtonLabel);

        fireEvent.click(searchButton);

        expect(basicProps.onSetSelectedUser).not.toHaveBeenCalled();
      });
    });

    describe('When user has a barcode', () => {
      const user = {
        barcode: 'userBarcode',
      };

      beforeEach(() => {
        Pluggable.mockImplementationOnce(({ selectUser }) => (
          <button
            type="button"
            data-testid={testIds.searchUser}
            onClick={() => selectUser(user)}
          >
            Search
          </button>
        ));

        render(
          <RequesterInformation
            {...basicProps}
          />
        );

        const searchButton = screen.getByTestId(testIds.searchUser);

        fireEvent.click(searchButton);
      });

      it('should trigger set selected user to null', () => {
        expect(basicProps.onSetSelectedUser).toHaveBeenCalledWith(null);
      });

      it('should find user', () => {
        const expectedArgs = [RESOURCE_KEYS.BARCODE, user.barcode];

        expect(basicProps.findUser).toHaveBeenCalledWith(...expectedArgs);
      });
    });

    describe('When user does not have a barcode', () => {
      const user = {
        id: 'userId',
      };

      beforeEach(() => {
        Pluggable.mockImplementationOnce(({
          selectUser,
        }) => (
          <button
            type="button"
            onClick={() => selectUser(user)}
            data-testid={testIds.searchUser}
          >
            Search
          </button>
        ));

        render(
          <RequesterInformation
            {...basicProps}
          />
        );

        const searchButton = screen.getByTestId(testIds.searchUser);

        fireEvent.click(searchButton);
      });

      it('should trigger set selected user to null', () => {
        expect(basicProps.onSetSelectedUser).toHaveBeenCalledWith(null);
      });

      it('should find user', () => {
        const expectedArgs = [RESOURCE_KEYS.ID, user.id];

        expect(basicProps.findUser).toHaveBeenCalledWith(...expectedArgs);
      });
    });
  });

  describe('Spinner', () => {
    describe('When data is loading', () => {
      const props = {
        ...basicProps,
        isLoading: true,
      };

      beforeEach(() => {
        render(
          <RequesterInformation
            {...props}
          />
        );
      });

      it('should trigger loading Icon with correct props', () => {
        expect(Icon).toHaveBeenCalledWith(BASE_SPINNER_PROPS, {});
      });
    });

    describe('When data is not loading', () => {
      beforeEach(() => {
        render(
          <RequesterInformation
            {...basicProps}
          />
        );
      });

      it('should not render loading Icon', () => {
        expect(Icon).not.toHaveBeenCalled();
      });
    });
  });
});
