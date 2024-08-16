import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import UserForm from './UserForm';
import UserHighlightBox from '../UserHighlightBox';
import { getProxyInformation } from '../../../../utils';

const basicProps = {
  user: {
    lastName: 'userLastName',
    barcode: 'userBarcode',
    id: 'userId',
  },
  request: {},
  proxy: {},
  selectProxy: jest.fn(),
  handleCloseProxy: jest.fn(),
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
  getProxyInformation: jest.fn(() => proxy),
  getRequesterName: jest.fn((user) => user.lastName),
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
  });

  describe('When proxy information is not provided', () => {
    beforeEach(() => {
      getProxyInformation.mockReturnValueOnce({});

      render(
        <UserForm
          {...basicProps}
        />
      );
    });

    it('should trigger UserHighlightBox once', () => {
      expect(UserHighlightBox).toHaveBeenCalledTimes(1);
    });
  });
});
