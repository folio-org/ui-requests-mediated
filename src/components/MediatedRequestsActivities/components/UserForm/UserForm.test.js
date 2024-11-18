import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { ProxyManager } from '@folio/stripes/smart-components';

import UserForm from './UserForm';
import UserHighlightBox from '../UserHighlightBox';
import { getProxyInformation } from '../../../../utils';

const proxy = {
  name: 'proxyName',
  id: 'proxyId',
  barcode: 'proxyBarcode',
};
const basicProps = {
  user: {
    lastName: 'userLastName',
    barcode: 'userBarcode',
    id: 'userId',
  },
  request: {},
  proxy,
  selectRequester: jest.fn(),
  closeProxyManager: jest.fn(),
  isEditMode: false,
  isUserPreselected: false,
  isEditPermission: true,
};
const labelIds = {
  userTitle: 'ui-requests-mediated.requesterDetails.requester',
  proxyTitle: 'ui-requests-mediated.requesterDetails.proxy',
  patronGroup: 'ui-requests-mediated.requesterDetails.patronGroup',
};

jest.mock('../../../../utils', () => ({
  getProxyInformation: jest.fn(() => proxy),
  getRequesterName: jest.fn((user) => user.lastName),
  isProxyFunctionalityAvailable: jest.fn(() => true),
}));
jest.mock('../UserHighlightBox', () => jest.fn(({
  title,
  name,
  barcode,
}) => (
  <>
    <span>{title}</span>
    <span>{name}</span>
    <span>{barcode}</span>
  </>
)));

describe('UserForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When creation mode', () => {
    describe('When proxy information is provided', () => {
      beforeEach(() => {
        render(
          <UserForm
            {...basicProps}
          />
        );
      });

      it('should render patron group title', () => {
        const patronGroupTitle = screen.getByText(labelIds.patronGroup);

        expect(patronGroupTitle).toBeInTheDocument();
      });

      it('should render user title', () => {
        const userTitle = screen.getByText(labelIds.userTitle);

        expect(userTitle).toBeInTheDocument();
      });

      it('should trigger UserHighlightBox with user data', () => {
        const expectedProps = {
          id: basicProps.user.id,
          barcode: basicProps.user.barcode,
          name: basicProps.user.lastName,
        };

        expect(UserHighlightBox).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
      });

      it('should trigger UserHighlightBox with proxy data', () => {
        const expectedProps = {
          id: proxy.id,
          name: proxy.name,
          barcode: proxy.barcode,
        };

        expect(UserHighlightBox).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
      });

      it('should trigger ProxyManager with correct props', () => {
        const expectedProps = {
          patron: basicProps.user,
          proxy: basicProps.proxy,
          onClose: basicProps.closeProxyManager,
          onSelectPatron: basicProps.selectRequester,
        };

        expect(ProxyManager).toHaveBeenCalledWith(expectedProps, {});
      });
    });

    describe('When proxy information is not provided', () => {
      const props = {
        ...basicProps,
        proxy: undefined,
      };

      beforeEach(() => {
        getProxyInformation.mockReturnValueOnce({});

        render(
          <UserForm
            {...props}
          />
        );
      });

      it('should trigger UserHighlightBox once', () => {
        expect(UserHighlightBox).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('When edit mode', () => {
    const props = {
      ...basicProps,
      isEditMode: true,
    };

    beforeEach(() => {
      render(
        <UserForm
          {...props}
        />
      );
    });

    it('should trigger ProxyManager with correct props', () => {
      const expectedProps = {
        patron: basicProps.user,
        proxy: basicProps.proxy,
        onSelectPatron: basicProps.selectRequester,
        onClose: basicProps.closeProxyManager,
      };

      expect(ProxyManager).toHaveBeenCalledWith(expectedProps, {});
    });
  });
});
