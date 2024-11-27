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

import InstanceInformation, {
  INSTANCE_SEGMENT_FOR_PLUGIN,
} from './InstanceInformation';
import TitleInformation from '../TitleInformation';
import {
  BASE_SPINNER_PROPS,
  ENTER_EVENT_KEY,
  MEDIATED_REQUEST_FORM_FIELD_NAMES,
} from '../../../../constants';

jest.mock('../../../../utils', () => ({
  memoizeValidation: (fn) => () => fn,
}));
jest.mock('../TitleInformation', () => jest.fn(() => <div />));

const basicProps = {
  triggerValidation: jest.fn(),
  findInstance: jest.fn(() => null),
  getInstanceValidationData: jest.fn(() => null),
  onSetSelectedInstance: jest.fn(),
  form: {
    change: jest.fn(),
  },
  values: {
    instance: {
      hrid: 'hrid',
    },
    keyOfInstanceIdField: 1,
  },
  request: {
    id: '',
  },
  isLoading: false,
  submitting: false,
  isInstancePreselected: false,
  isEditMode: false,
  stripes: {
    hasPerm: jest.fn(() => true),
  },
};
const labelIds = {
  inputPlaceholder: 'ui-requests-mediated.form.instance.inputPlaceholder',
  instanceHrid: 'ui-requests-mediated.form.instance.inputLabel',
  enterButton: 'ui-requests-mediated.form.enterButton',
  selectInstance: 'ui-requests-mediated.form.errors.selectInstance',
  titleDoesNotExist: 'ui-requests-mediated.form.errors.titleDoesNotExist',
  lookupLabel: 'ui-requests-mediated.form.instance.lookupLabel',
};
const testIds = {
  instanceHridField: 'instanceHridField',
  errorMessage: 'errorMessage',
};
const renderInstanceInfoWithHrid = (onBlur) => {
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
        value: 'hrid',
        onBlur,
      },
    });
  }));

  const { rerender } = render(
    <InstanceInformation
      {...basicProps}
    />
  );

  return rerender;
};

describe('InstanceInformation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial render', () => {
    beforeEach(() => {
      render(
        <InstanceInformation
          {...basicProps}
        />
      );
    });

    it('should trigger instance hrid Field with correct props', () => {
      const expectedProps = {
        name: MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID,
        validate: expect.any(Function),
        validateFields: [],
      };

      expect(Field).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should render input placeholder', () => {
      const inputPlaceholder = screen.getByPlaceholderText(labelIds.inputPlaceholder);

      expect(inputPlaceholder).toBeVisible();
    });

    it('should render instance hrid label', () => {
      const instanceHridLabel = screen.getByText(labelIds.instanceHrid);

      expect(instanceHridLabel).toBeVisible();
    });

    it('should find instance data when Enter key is pressed', () => {
      const instanceHridField = screen.getByTestId(testIds.instanceHridField);

      fireEvent.keyDown(instanceHridField, { key: ENTER_EVENT_KEY });

      expect(basicProps.findInstance).toHaveBeenCalledWith(basicProps.values.instance.hrid);
    });

    it('should not find instance data when Control key is pressed', () => {
      const instanceHridField = screen.getByTestId(testIds.instanceHridField);

      fireEvent.keyDown(instanceHridField, { key: 'Control' });

      expect(basicProps.findInstance).not.toHaveBeenCalledWith();
    });

    it('should change instanceHrid form value', () => {
      const instanceHridField = screen.getByTestId(testIds.instanceHridField);
      const event = {
        target: {
          value: 'instanceHrid',
        },
      };

      fireEvent.change(instanceHridField, event);

      expect(basicProps.form.change).toHaveBeenCalledWith(MEDIATED_REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, event.target.value);
    });

    it('should trigger TextField with correct props', () => {
      const expectedProps = {
        required: true,
        error: null,
        placeholder: labelIds.inputPlaceholder,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        onKeyDown: expect.any(Function),
      };

      expect(TextField).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should trigger Pluggable with correct props', () => {
      const expectedProps = {
        searchButtonStyle: 'link',
        type: 'find-instance',
        selectInstance: expect.any(Function),
        config: {
          availableSegments: [{ name: INSTANCE_SEGMENT_FOR_PLUGIN }],
        },
      };

      expect(Pluggable).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should render title lookup plugin label', () => {
      const titleLookupPluginLabel = screen.getByText(labelIds.lookupLabel);

      expect(titleLookupPluginLabel).toBeVisible();
    });

    it('should find instance from title look-up', () => {
      const hrid = 'hrid';
      const searchButtonLabel = 'Search';
      const searchButton = screen.getByText(searchButtonLabel);

      fireEvent.click(searchButton);

      expect(basicProps.findInstance).toHaveBeenCalledWith(hrid);
    });
  });

  describe('handleBlur', () => {
    const onBlur = jest.fn();

    afterEach(() => {
      onBlur.mockClear();
    });

    it('should trigger "input.onBlur" if instance hrid is presented', () => {
      renderInstanceInfoWithHrid(onBlur);

      const instanceHridField = screen.getByTestId(testIds.instanceHridField);

      fireEvent.click(instanceHridField);
      fireEvent.blur(instanceHridField);

      expect(onBlur).toHaveBeenCalled();
    });

    it('should trigger "input.onBlur" if there is no instance hrid', () => {
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
        <InstanceInformation
          {...basicProps}
        />
      );

      const instanceHridField = screen.getByTestId(testIds.instanceHridField);

      fireEvent.click(instanceHridField);
      fireEvent.blur(instanceHridField);

      expect(onBlur).toHaveBeenCalled();
    });

    it('should not trigger "input.onBlur" if instance hrid was validated previously', () => {
      renderInstanceInfoWithHrid(onBlur);

      const instanceHridField = screen.getByTestId(testIds.instanceHridField);

      // first input focus
      fireEvent.click(instanceHridField);
      fireEvent.blur(instanceHridField);
      onBlur.mockClear();

      // second input focus after validation of initial value
      fireEvent.click(instanceHridField);
      fireEvent.blur(instanceHridField);

      expect(onBlur).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    afterEach(() => {
      basicProps.getInstanceValidationData.mockClear();
      TextField.mockClear();
    });

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
              value="test"
              onChange={handleChange}
              {...rest}
            />
            <span data-testid="errorMessage">{error}</span>
          </div>
        );
      });
    });

    describe('When instance hrid is not presented', () => {
      const event = {
        target: {
          value: '',
        },
      };

      it('should not render error message', async () => {
        render(
          <InstanceInformation
            {...basicProps}
          />
        );

        const instanceHridField = screen.getByTestId(testIds.instanceHridField);

        fireEvent.change(instanceHridField, event);

        await waitFor(() => {
          const errorMessage = screen.getByTestId(testIds.errorMessage);

          expect(errorMessage).toBeEmpty();
        });
      });

      it('should render "selectInstance" error message', async () => {
        const props = {
          ...basicProps,
          selectedInstance: {
            id: 'id',
          },
        };

        render(
          <InstanceInformation
            {...props}
          />
        );

        const instanceHridField = screen.getByTestId(testIds.instanceHridField);

        fireEvent.change(instanceHridField, event);

        await waitFor(() => {
          const errorMessage = screen.queryByText(labelIds.selectInstance);

          expect(errorMessage).toBeVisible();
        });
      });
    });

    describe('When instance hrid is presented', () => {
      const event = {
        target: {
          value: 'instanceId',
        },
      };

      beforeEach(() => {
        render(
          <InstanceInformation
            {...basicProps}
          />
        );
      });

      it('should not render error message', async () => {
        const instanceHridField = screen.getByTestId(testIds.instanceHridField);

        fireEvent.change(instanceHridField, event);

        await waitFor(() => {
          const errorMessage = screen.getByTestId(testIds.errorMessage);

          expect(errorMessage).toBeEmpty();
        });
      });

      it('should render "titleDoesNotExist" error message', async () => {
        const instanceHridField = screen.getByTestId(testIds.instanceHridField);

        fireEvent.keyDown(instanceHridField, { key: ENTER_EVENT_KEY });
        fireEvent.change(instanceHridField, event);

        await waitFor(() => {
          const errorMessage = screen.queryByText(labelIds.titleDoesNotExist);

          expect(errorMessage).toBeVisible();
        });
      });

      it('should not render error message if instance found', async () => {
        const instanceHridField = screen.getByTestId(testIds.instanceHridField);

        basicProps.getInstanceValidationData.mockReturnValue({});
        fireEvent.keyDown(instanceHridField, { key: ENTER_EVENT_KEY });
        fireEvent.change(instanceHridField, event);

        await waitFor(() => {
          const errorMessage = screen.getByTestId(testIds.errorMessage);

          expect(errorMessage).toBeEmpty();
        });
      });
    });
  });

  describe('Enter button', () => {
    describe('When instance hrid is presented', () => {
      beforeEach(() => {
        render(
          <InstanceInformation
            {...basicProps}
          />
        );
      });

      it('should render Enter button', () => {
        const enterButton = screen.getByText(labelIds.enterButton);

        expect(enterButton).toBeVisible();
      });

      it('should reset instance information', () => {
        const enterButton = screen.getByText(labelIds.enterButton);

        fireEvent.click(enterButton);

        expect(basicProps.onSetSelectedInstance).toHaveBeenCalledWith(null);
      });

      it('should find instance', () => {
        const enterButton = screen.getByText(labelIds.enterButton);

        fireEvent.click(enterButton);

        expect(basicProps.findInstance).toHaveBeenCalledWith(basicProps.values.instance.hrid);
      });
    });

    describe('When instance hrid is not presented', () => {
      const props = {
        ...basicProps,
        values: {
          instance: {
            hrid: '',
          },
        },
      };

      beforeEach(() => {
        render(
          <InstanceInformation
            {...props}
          />
        );
      });

      it('should not change instance information', () => {
        const enterButton = screen.getByText(labelIds.enterButton);

        fireEvent.click(enterButton);

        expect(basicProps.onSetSelectedInstance).not.toHaveBeenCalled();
      });
    });
  });

  describe('Spinner', () => {
    afterEach(() => {
      Icon.mockClear();
    });

    describe('When data is loading', () => {
      const props = {
        ...basicProps,
        isLoading: true,
      };

      beforeEach(() => {
        render(
          <InstanceInformation
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
          <InstanceInformation
            {...basicProps}
          />
        );
      });

      it('should not trigger loading Icon', () => {
        expect(Icon).not.toHaveBeenCalled();
      });
    });
  });

  describe('TitleInformation', () => {
    afterEach(() => {
      TitleInformation.mockClear();
    });

    describe('When instance is selected', () => {
      const selectedInstance = {
        title: 'instance title',
        contributors: [],
        publication: [],
        editions: [],
        identifiers: [],
      };

      it('should trigger TitleInformation with correct props', () => {
        const props = {
          ...basicProps,
          selectedInstance,
        };

        render(
          <InstanceInformation
            {...props}
          />
        );

        const expectedProps = {
          title: selectedInstance.title,
          contributors: selectedInstance.contributors,
          publications: selectedInstance.publication,
          editions: selectedInstance.editions,
          identifiers: selectedInstance.identifiers,
        };

        expect(TitleInformation).toHaveBeenCalledWith(expectedProps, {});
      });
    });

    describe('When instance is not selected', () => {
      beforeEach(() => {
        render(
          <InstanceInformation
            {...basicProps}
          />
        );
      });

      it('should not trigger "TitleInformation"', () => {
        expect(TitleInformation).not.toHaveBeenCalled();
      });
    });
  });

  describe('Component updating', () => {
    it('should not trigger onBlur handler', () => {
      const onBlur = jest.fn();
      const rerender = renderInstanceInfoWithHrid(onBlur);
      const newProps = {
        ...basicProps,
        isInstancePreselected: true,
        selectedInstance: {
          hrid: 'hrid',
        },
      };

      rerender(
        <InstanceInformation
          {...newProps}
        />
      );

      const instanceHridField = screen.getByTestId(testIds.instanceHridField);

      fireEvent.click(instanceHridField);
      fireEvent.blur(instanceHridField);

      expect(onBlur).not.toHaveBeenCalled();
    });

    it('should trigger validation', () => {
      const rerender = renderInstanceInfoWithHrid();
      const newProps = {
        ...basicProps,
        isInstancePreselected: true,
        selectedInstance: null,
        isEditMode: true,
        request: {
          instance: {
            hrid: 'hrid',
          },
        },
      };

      rerender(
        <InstanceInformation
          {...newProps}
        />
      );

      expect(basicProps.triggerValidation).toHaveBeenCalled();
    });
  });
});
