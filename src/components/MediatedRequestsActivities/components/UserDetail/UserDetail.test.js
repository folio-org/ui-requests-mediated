import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import UserDetail from './UserDetail';
import UserHighlightBox from '../UserHighlightBox';
import { getProxyInformation } from '../../../../utils';

const basicProps = {
  user: {
    lastName: 'userLastName',
    barcode: 'userBarcode',
    id: 'userId',
  },
  patronGroup: 'patronGroup',
  userPreferences: {
    label: 'userPreferencesLabel',
    value: 'userPreferencesValue',
  },
  request: {},
  proxy: {},
};
const labelIds = {
  userTitle: 'ui-requests-mediated.requesterDetails.requester',
  proxyTitle: 'ui-requests-mediated.requesterDetails.proxy',
  patronGroup: 'ui-requests-mediated.requesterDetails.patronGroup',
};
const proxy = {
  name: 'proxyName',
  id: 'proxyId',
  barcode: 'proxyBarcode',
};

jest.mock('../../../../utils', () => ({
  getRequesterName: jest.fn((user) => user.lastName),
  getProxyInformation: jest.fn(() => proxy),
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

describe('UserDetail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When user id is provided', () => {
    beforeEach(() => {
      render(
        <UserDetail
          {...basicProps}
        />
      );
    });

    it('should render user title', () => {
      const userTitle = screen.getByText(labelIds.userTitle);

      expect(userTitle).toBeInTheDocument();
    });

    it('should render patron group title', () => {
      const patronGroupTitle = screen.getByText(labelIds.patronGroup);

      expect(patronGroupTitle).toBeInTheDocument();
    });

    it('should trigger UserHighlightBox with user data', () => {
      const expectedProps = {
        name: basicProps.user.lastName,
        id: basicProps.user.id,
        barcode: basicProps.user.barcode,
      };

      expect(UserHighlightBox).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('When user id is not provided', () => {
    const props = {
      ...basicProps,
      user: {
        ...basicProps.user,
        id: undefined,
      },
      request: {
        requesterId: 'requesterId',
      },
    };

    beforeEach(() => {
      render(
        <UserDetail
          {...props}
        />
      );
    });

    it('should trigger UserHighlightBox with requester id', () => {
      const expectedProps = {
        name: props.user.lastName,
        id: props.request.requesterId,
        barcode: props.user.barcode,
      };

      expect(UserHighlightBox).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('When proxy information exists', () => {
    beforeEach(() => {
      render(
        <UserDetail
          {...basicProps}
        />
      );
    });

    it('should render proxy title', () => {
      const proxyTitle = screen.getByText(labelIds.proxyTitle);

      expect(proxyTitle).toBeInTheDocument();
    });

    it('should trigger UserHighlightBox with proxy data', () => {
      const expectedProps = {
        name: proxy.name,
        id: proxy.id,
        barcode: proxy.barcode,
      };

      expect(UserHighlightBox).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });
  });

  describe('When proxy information does not exist', () => {
    beforeEach(() => {
      getProxyInformation.mockReturnValueOnce({});

      render(
        <UserDetail
          {...basicProps}
        />
      );
    });

    it('should not render proxy title', () => {
      const proxyTitle = screen.queryByText(labelIds.proxyTitle);

      expect(proxyTitle).not.toBeInTheDocument();
    });
  });
});
