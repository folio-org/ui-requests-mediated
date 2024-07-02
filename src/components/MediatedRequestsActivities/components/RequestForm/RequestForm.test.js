import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import RequestForm from './RequestForm';

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

jest.mock('@folio/stripes/final-form', () => () => jest.fn((component) => component));
jest.mock('../RequestFormShortcutsWrapper', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('../RequestFormFirstMenu', () => jest.fn(() => <div/>));
jest.mock('../RequestFormFooter', () => jest.fn(() => <div/>));
jest.mock('../ItemInformation', () => jest.fn(() => <div/>));
jest.mock('../InstanceInformation', () => jest.fn(() => <div/>));
jest.mock('../RequesterInformation', () => jest.fn(() => <div/>));
jest.mock('../ItemsDialog', () => jest.fn(() => <div/>));
jest.mock('../../../../utils', () => ({
  getTlrSettings: jest.fn(() => ({
    titleLevelRequestsFeatureEnabled: true,
  })),
  handleKeyCommand: jest.fn(),
  getPatronGroup: jest.fn(),
  isSubmittingButtonDisabled: jest.fn(),
}));

describe('RequestForm', () => {

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
});
