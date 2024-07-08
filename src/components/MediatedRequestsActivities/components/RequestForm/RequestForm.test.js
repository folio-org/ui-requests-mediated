import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import RequestForm from './RequestForm';
import {
  REQUEST_FORM_FIELD_NAMES,
  RESOURCE_KEYS,
  RESOURCE_TYPES,
} from '../../../../constants';

const basicProps = {
  handleSubmit: jest.fn(),
  findResource: jest.fn(),
  onCancel: jest.fn(),
  onSetSelectedItem: jest.fn(),
  onSetSelectedUser: jest.fn(),
  onSetSelectedInstance: jest.fn(),
  request: {},
  initialValues: {},
  location: {
    search: '',
  },
  values: {
    createTitleLevelRequest: false,
  },
  form: {
    change: jest.fn(),
  },
  pristine: true,
  submitting: false,
  patronGroups: [],
  selectedItem: {},
  selectedInstance: {},
  selectedUser: {},
};
const labelIds = {
  itemAccordion: 'ui-requests-mediated.form.item.accordionLabel',
};
const testIds = {
  findItem: 'findItem',
  findInstance: 'findInstance',
};
const itemBarcode = 'itemBarcode';
const instanceId = 'instanceId';

jest.mock('@folio/stripes/final-form', () => () => jest.fn((component) => component));
jest.mock('../RequestFormShortcutsWrapper', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('../RequestFormFirstMenu', () => jest.fn(() => <div />));
jest.mock('../RequestFormFooter', () => jest.fn(() => <div />));
jest.mock('../ItemInformation', () => jest.fn(({
  findItem,
}) => {
  const onFindItem = () => {
    findItem('barcode', itemBarcode);
  };

  return (
    <>
      <button
        type="button"
        data-testid={testIds.findItem}
        onClick={onFindItem}
      >
        Find Item
      </button>
    </>
  );
}));
jest.mock('../InstanceInformation', () => jest.fn(({
  findInstance,
}) => {
  const onFindInstance = () => {
    findInstance(instanceId);
  };

  return (
    <>
      <button
        type="button"
        data-testid={testIds.findInstance}
        onClick={onFindInstance}
      >
        Find Instance
      </button>
    </>
  );
}));
jest.mock('../RequesterInformation', () => jest.fn(() => <div />));
jest.mock('../ItemsDialog', () => jest.fn(() => <div />));
jest.mock('../../../../utils', () => ({
  getTlrSettings: jest.fn(() => ({
    titleLevelRequestsFeatureEnabled: true,
  })),
  handleKeyCommand: jest.fn(),
  getPatronGroup: jest.fn(),
  isSubmittingButtonDisabled: jest.fn(),
}));

describe('RequestForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial render', () => {
    beforeEach(() => {
      render(
        <RequestForm
          {...basicProps}
        />
      );
    });

    it('should render item accordion label', () => {
      const accordionLabel = screen.getByText(labelIds.itemAccordion);

      expect(accordionLabel).toBeInTheDocument();
    });
  });

  describe('ItemInformation', () => {
    describe('When item data exists', () => {
      const foundItem = {
        items: [
          {
            id: 'itemId',
            barcode: 'itemBarcode',
          }
        ],
      };
      const foundLoan = {
        loans: [],
      };
      const foundRequests = {
        requests: [],
      };

      beforeEach(() => {
        render(
          <RequestForm
            {...basicProps}
          />
        );

        const findItemButton = screen.getByTestId(testIds.findItem);

        basicProps.findResource
          .mockResolvedValueOnce(foundItem)
          .mockResolvedValueOnce(foundLoan)
          .mockResolvedValueOnce(foundRequests);
        fireEvent.click(findItemButton);
      });

      it('should find item', () => {
        const expectedArgs = [RESOURCE_TYPES.ITEM, itemBarcode, RESOURCE_KEYS.BARCODE];

        expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set item id form value', () => {
        const expectedArgs = [REQUEST_FORM_FIELD_NAMES.ITEM_ID, foundItem.items[0].id];

        expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set item barcode form value', () => {
        const expectedArgs = [REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, foundItem.items[0].barcode];

        expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set selected item', () => {
        expect(basicProps.onSetSelectedItem).toHaveBeenCalledWith(foundItem.items[0]);
      });

      it('should find related loans', () => {
        const expectedArgs = [RESOURCE_TYPES.LOAN, foundItem.items[0].id];

        expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should find item requests', () => {
        const expectedArgs = [RESOURCE_TYPES.REQUESTS_FOR_ITEM, foundItem.items[0].id];

        expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
      });
    });

    describe('When item data does not exist', () => {
      const foundItem = {
        items: [],
      };

      beforeEach(() => {
        render(
          <RequestForm
            {...basicProps}
          />
        );

        const findItemButton = screen.getByTestId(testIds.findItem);

        basicProps.findResource.mockResolvedValueOnce(foundItem);
        fireEvent.click(findItemButton);
      });

      it('should not set item id form value', async () => {
        const expectedArgs = [REQUEST_FORM_FIELD_NAMES.ITEM_ID, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });

      it('should not set item barcode form value', async () => {
        const expectedArgs = [REQUEST_FORM_FIELD_NAMES.ITEM_BARCODE, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });
    });

    describe('When item data request throws error', () => {
      beforeEach(() => {
        render(
          <RequestForm
            {...basicProps}
          />
        );

        const findItemButton = screen.getByTestId(testIds.findItem);

        basicProps.findResource.mockRejectedValueOnce({});
        fireEvent.click(findItemButton);
      });

      it('should set selected item to null', async () => {
        await waitFor(() => {
          expect(basicProps.onSetSelectedItem).toHaveBeenCalledWith(null);
        });
      });
    });
  });

  describe('InstanceInformation', () => {
    const props = {
      ...basicProps,
      values: {
        createTitleLevelRequest: true,
      },
    };

    describe('When instance data exists', () => {
      const foundInstance = {
        id: instanceId,
        hrid: 'hrid',
      };
      const foundRequests = {
        requests: [],
      };

      beforeEach(() => {
        render(
          <RequestForm
            {...props}
          />
        );

        const findInstanceButton = screen.getByTestId(testIds.findInstance);

        basicProps.findResource
          .mockResolvedValueOnce(foundInstance)
          .mockResolvedValueOnce(foundRequests);
        fireEvent.click(findInstanceButton);
      });

      it('should find instance', () => {
        const expectedArgs = [RESOURCE_TYPES.INSTANCE, instanceId];

        expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set instance id form value', () => {
        const expectedArgs = [REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, foundInstance.id];

        expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set instance hrid form value', () => {
        const expectedArgs = [REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, foundInstance.hrid];

        expect(basicProps.form.change).toHaveBeenCalledWith(...expectedArgs);
      });

      it('should set selected instance', () => {
        expect(basicProps.onSetSelectedInstance).toHaveBeenCalledWith(foundInstance);
      });

      it('should find instance requests', () => {
        const expectedArgs = [RESOURCE_TYPES.REQUESTS_FOR_INSTANCE, foundInstance.id];

        expect(basicProps.findResource).toHaveBeenCalledWith(...expectedArgs);
      });
    });

    describe('When instance data does not exist', () => {
      const foundInstance = {};

      beforeEach(() => {
        render(
          <RequestForm
            {...props}
          />
        );

        const findInstanceButton = screen.getByTestId(testIds.findInstance);

        basicProps.findResource.mockResolvedValueOnce(foundInstance);
        fireEvent.click(findInstanceButton);
      });

      it('should not set instance id form value', async () => {
        const expectedArgs = [REQUEST_FORM_FIELD_NAMES.INSTANCE_ID, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });

      it('should not set instance hrid form value', async () => {
        const expectedArgs = [REQUEST_FORM_FIELD_NAMES.INSTANCE_HRID, expect.any(String)];

        await waitFor(() => {
          expect(basicProps.form.change).not.toHaveBeenCalledWith(...expectedArgs);
        });
      });
    });

    describe('When instance data request throws error', () => {
      beforeEach(() => {
        render(
          <RequestForm
            {...props}
          />
        );

        const findInstanceButton = screen.getByTestId(testIds.findInstance);

        basicProps.findResource.mockRejectedValueOnce({});
        fireEvent.click(findInstanceButton);
      });

      it('should set selected instance to null', async () => {
        await waitFor(() => {
          expect(basicProps.onSetSelectedInstance).toHaveBeenCalledWith(null);
        });
      });
    });
  });
});
