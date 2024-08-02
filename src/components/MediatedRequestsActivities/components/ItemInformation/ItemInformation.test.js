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

import ItemInformation from './ItemInformation';
import ItemDetail from '../ItemDetail';
import { isFormEditing } from '../../../../utils';
import {
  MEDIATED_REQUEST_FORM_FIELD_NAMES,
  RESOURCE_KEYS,
  ENTER_EVENT_KEY,
  BASE_SPINNER_PROPS,
} from '../../../../constants';

jest.mock('../../../../utils', () => ({
  isFormEditing: jest.fn(() => false),
  memoizeValidation: (fn) => () => fn,
}));
jest.mock('../ItemDetail', () => jest.fn(() => <div />));

const basicProps = {
  triggerValidation: jest.fn(),
  findItem: jest.fn(() => null),
  getItemValidationData: jest.fn(() => null),
  onSetSelectedItem: jest.fn(),
  form: {
    change: jest.fn(),
  },
  values: {
    item: {
      barcode: 'itemBarcode',
    },
    keyOfItemBarcodeField: 1,
  },
  request: {
    id: '',
  },
  selectedLoan: {},
  selectedItem: {},
  instanceId: 'instanceId',
  isLoading: false,
  submitting: false,
  isItemIdRequest: true,
};
const labelIds = {
  inputPlaceholder: 'ui-requests-mediated.form.item.inputPlaceholder',
  inputLabel: 'ui-requests-mediated.form.item.inputLabel',
  enterButton: 'ui-requests-mediated.form.enterButton',
  selectItem: 'ui-requests-mediated.form.errors.selectItem',
  itemDoesNotExist: 'ui-requests-mediated.form.errors.itemDoesNotExist',
};
const testIds = {
  itemBarcodeField: 'itemBarcodeField',
  errorMessage: 'errorMessage',
};
const renderItemInfoWithBarcode = (onBlur) => {
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
        value: 'itemBarcode',
        onBlur,
      },
    });
  }));

  render(
    <ItemInformation
      {...basicProps}
    />
  );
};

describe('ItemInformation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When creation form', () => {
    beforeEach(() => {
      render(
        <ItemInformation
          {...basicProps}
        />
      );
    });

    it('should render input placeholder', () => {
      const inputPlaceholder = screen.getByPlaceholderText(labelIds.inputPlaceholder);

      expect(inputPlaceholder).toBeVisible();
    });

    it('should trigger Field with correct props', () => {
      const expectedProps = {
        name: MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE,
        validate: expect.any(Function),
        validateFields: [],
      };

      expect(Field).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should render item barcode label', () => {
      const itemBarcodeLabel = screen.getByText(labelIds.inputLabel);

      expect(itemBarcodeLabel).toBeVisible();
    });

    it('should find items when Enter key is pressed', () => {
      const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

      fireEvent.keyDown(itemBarcodeField, { key: ENTER_EVENT_KEY });

      expect(basicProps.findItem).toHaveBeenCalledWith(RESOURCE_KEYS.BARCODE, basicProps.values.item.barcode);
    });

    it('should not find items when Control key is pressed', () => {
      const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

      fireEvent.keyDown(itemBarcodeField, { key: 'Control' });

      expect(basicProps.findItem).not.toHaveBeenCalledWith();
    });

    it('should change form values', () => {
      const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);
      const event = {
        target: {
          value: 'itemBarcode',
        },
      };

      fireEvent.change(itemBarcodeField, event);

      expect(basicProps.form.change).toHaveBeenCalledWith(MEDIATED_REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, event.target.value);
    });

    it('should trigger TextField with correct props', () => {
      const expectedProps = {
        required: true,
        error: null,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        onKeyDown: expect.any(Function),
      };

      expect(TextField).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('When editing form', () => {
    beforeEach(() => {
      isFormEditing.mockReturnValueOnce(true);

      render(
        <ItemInformation
          {...basicProps}
        />
      );
    });

    it('should not render input placeholder', () => {
      const inputPlaceholder = screen.queryByPlaceholderText(labelIds.inputPlaceholder);

      expect(inputPlaceholder).not.toBeInTheDocument();
    });

    it('should not render item barcode field', () => {
      const itemBarcodeField = screen.queryByTestId(testIds.itemBarcodeField);

      expect(itemBarcodeField).not.toBeInTheDocument();
    });

    it('should not render item barcode label', () => {
      const itemBarcodeLabel = screen.queryByText(labelIds.inputLabel);

      expect(itemBarcodeLabel).not.toBeInTheDocument();
    });
  });

  describe('handleBlur', () => {
    const onBlur = jest.fn();

    afterEach(() => {
      onBlur.mockClear();
    });

    it('should trigger "input.onBlur" if item barcode is presented', () => {
      renderItemInfoWithBarcode(onBlur);

      const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

      fireEvent.click(itemBarcodeField);
      fireEvent.blur(itemBarcodeField);

      expect(onBlur).toHaveBeenCalled();
    });

    it('should trigger "input.onBlur" if there is no item barcode', () => {
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
            value: '',
            onBlur,
          },
        });
      }));

      render(
        <ItemInformation
          {...basicProps}
        />
      );

      const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

      fireEvent.click(itemBarcodeField);
      fireEvent.blur(itemBarcodeField);

      expect(onBlur).toHaveBeenCalled();
    });

    it('should not trigger "input.onBlur" if item barcode was validated previously', () => {
      renderItemInfoWithBarcode(onBlur);

      const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

      // first input focus
      fireEvent.click(itemBarcodeField);
      fireEvent.blur(itemBarcodeField);
      onBlur.mockClear();

      // second input focus after validation of initial value
      fireEvent.click(itemBarcodeField);
      fireEvent.blur(itemBarcodeField);

      expect(onBlur).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      TextField.mockImplementation(jest.fn(({
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
              value="test"
              onChange={handleChange}
              {...rest}
            />
            <span data-testid="errorMessage">{error}</span>
          </div>
        );
      }));
    });

    describe('When barcode is presented', () => {
      const event = {
        target: {
          value: 'barcode',
        },
      };

      beforeEach(() => {
        render(
          <ItemInformation
            {...basicProps}
          />
        );
      });

      it('should not render error message', async () => {
        const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

        fireEvent.change(itemBarcodeField, event);

        await waitFor(() => {
          const errorMessage = screen.getByTestId(testIds.errorMessage);

          expect(errorMessage).toBeEmpty();
        });
      });

      it('should render "itemDoesNotExist" error message', async () => {
        const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

        fireEvent.keyDown(itemBarcodeField, { key: ENTER_EVENT_KEY });
        fireEvent.change(itemBarcodeField, event);

        await waitFor(() => {
          const errorMessage = screen.queryByText(labelIds.itemDoesNotExist);

          expect(errorMessage).toBeVisible();
        });
      });

      it('should not render error message if item found', async () => {
        const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

        basicProps.getItemValidationData.mockReturnValue({});
        fireEvent.keyDown(itemBarcodeField, { key: ENTER_EVENT_KEY });
        fireEvent.change(itemBarcodeField, event);

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
        render(
          <ItemInformation
            {...basicProps}
          />
        );

        const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

        fireEvent.change(itemBarcodeField, event);

        await waitFor(() => {
          const errorMessage = screen.getByTestId(testIds.errorMessage);

          expect(errorMessage).toBeEmpty();
        });
      });

      it('should render "selectItem" error message', async () => {
        const props = {
          ...basicProps,
          isItemIdRequest: false,
        };

        render(
          <ItemInformation
            {...props}
          />
        );

        const itemBarcodeField = screen.getByTestId(testIds.itemBarcodeField);

        fireEvent.change(itemBarcodeField, event);

        await waitFor(() => {
          const errorMessage = screen.queryByText(labelIds.selectItem);

          expect(errorMessage).toBeVisible();
        });
      });
    });
  });

  describe('Enter button', () => {
    describe('When barcode is presented', () => {
      beforeEach(() => {
        render(
          <ItemInformation
            {...basicProps}
          />
        );
      });

      it('should render Enter button', () => {
        const enterButton = screen.getByText(labelIds.enterButton);

        expect(enterButton).toBeVisible();
      });

      it('should trigger set selected item with correct argument', () => {
        const enterButton = screen.getByText(labelIds.enterButton);

        fireEvent.click(enterButton);

        expect(basicProps.onSetSelectedItem).toHaveBeenCalledWith(null);
      });

      it('should find item', () => {
        const enterButton = screen.getByText(labelIds.enterButton);

        fireEvent.click(enterButton);

        expect(basicProps.findItem).toHaveBeenCalledWith(RESOURCE_KEYS.BARCODE, basicProps.values.item.barcode);
      });
    });

    describe('When barcode is not presented', () => {
      const props = {
        ...basicProps,
        values: {
          item: {
            barcode: '',
          },
        },
      };

      beforeEach(() => {
        render(
          <ItemInformation
            {...props}
          />
        );
      });

      it('should not set selected item"', () => {
        const enterButton = screen.getByText(labelIds.enterButton);

        fireEvent.click(enterButton);

        expect(basicProps.onSetSelectedItem).not.toHaveBeenCalled();
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
          <ItemInformation
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
          <ItemInformation
            {...basicProps}
          />
        );
      });

      it('should not trigger loading Icon', () => {
        expect(Icon).not.toHaveBeenCalled();
      });
    });
  });

  describe('ItemDetails', () => {
    describe('When item is selected', () => {
      beforeEach(() => {
        render(
          <ItemInformation
            {...basicProps}
          />
        );
      });

      it('should trigger ItemDetail with correct props', () => {
        const expectedProps = {
          request: basicProps.request,
          item: basicProps.selectedItem,
          loan: basicProps.selectedLoan,
        };

        expect(ItemDetail).toHaveBeenCalledWith(expectedProps, {});
      });
    });

    describe('When item is not selected', () => {
      const props = {
        ...basicProps,
        selectedItem: undefined,
      };

      beforeEach(() => {
        render(
          <ItemInformation
            {...props}
          />
        );
      });

      it('should not trigger ItemDetail', () => {
        expect(ItemDetail).not.toHaveBeenCalled();
      });
    });
  });
});
