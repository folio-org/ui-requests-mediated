import { useHistory } from 'react-router-dom';

import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import RequestFormContainer, {
  urls,
} from './RequestFormContainer';
import RequestForm from '../RequestForm';
import {
  MEDIATED_REQUESTS_ACTIVITIES,
  MODULE_ROUTE,
  ITEM_QUERIES,
} from '../../../../constants';

const basicProps = {
  request: {},
  settings: {
    items: [
      {
        value: {
          createTitleLevelRequestsByDefault: false,
        },
      }
    ],
  },
  patronGroups: [],
};
const testIds = {
  cancelButton: 'cancelButton',
  findDataButton: 'findDataButton',
};

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));
jest.mock('query-string', () => ({
  stringify: jest.fn(({ query }) => `query=${query}`),
}));
jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  getInstanceQueryString: jest.fn(query => query),
  getStatusQuery: jest.fn(() => 'status'),
}));
jest.mock('../RequestForm', () => jest.fn(({
  onCancel,
  findResource,
}) => {
  const findItem = () => {
    findResource('item', 'test');
  };

  return (
    <>
      <button
        type="button"
        data-testid={testIds.cancelButton}
        onClick={onCancel}
      >Cancel</button>
      <button
        type="button"
        data-testid={testIds.findDataButton}
        onClick={findItem}
      >Find Data</button>
    </>
  );
}));

describe('RequestFormContainer', () => {
  describe('Component', () => {
    const history = {
      push: jest.fn(),
    };

    beforeEach(() => {
      useHistory.mockReturnValue(history);

      render(
        <RequestFormContainer
          {...basicProps}
        />
      );
    });

    it('should trigger RequestForm with correct props', () => {
      const expectedProps = {
        request: basicProps.request,
        settings: basicProps.settings,
        patronGroups: basicProps.patronGroups,
        initialValues: {
          createTitleLevelRequest: basicProps.settings.items[0].value.createTitleLevelRequestsByDefault,
        },
        onSetSelectedItem: expect.any(Function),
        onSetSelectedUser: expect.any(Function),
        onSetSelectedInstance: expect.any(Function),
        findResource: expect.any(Function),
        onSubmit: expect.any(Function),
        onCancel: expect.any(Function),
      };

      expect(RequestForm).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should cancel request creation', () => {
      const cancelButton = screen.getByTestId(testIds.cancelButton);
      const homeUrl = `/${MODULE_ROUTE}/${MEDIATED_REQUESTS_ACTIVITIES}`;

      fireEvent.click(cancelButton);

      expect(history.push).toHaveBeenCalledWith(homeUrl);
    });

    it('should find item data', () => {
      const findDataButton = screen.getByTestId(testIds.findDataButton);
      const itemUrl = `circulation/items-by-instance?query=(${ITEM_QUERIES['id']}=="test")`;

      fireEvent.click(findDataButton);

      expect(useOkapiKy().get).toHaveBeenCalledWith(itemUrl);
    });
  });

  describe('urls', () => {
    const idType = 'id';
    const value = 'value';

    it('should return url to get user data', () => {
      const expectedUrl = `users?query=(${idType}=="${value}")`;

      expect(urls.user(value, idType)).toBe(expectedUrl);
    });

    it('should return url to get item data', () => {
      const expectedUrl = `circulation/items-by-instance?query=(${ITEM_QUERIES[idType]}=="${value}")`;

      expect(urls.item(value, idType)).toBe(expectedUrl);
    });

    it('should return url to get instance data', () => {
      const expectedUrl = `circulation/items-by-instance?query=${value}`;

      expect(urls.instance(value)).toBe(expectedUrl);
    });

    it('should return url to get loan data', () => {
      const expectedUrl = `circulation/loans?query=(itemId=="${value}") and status.name==Open`;

      expect(urls.loan(value)).toBe(expectedUrl);
    });

    it('should return url to get requests for item data', () => {
      const expectedUrl = `circulation/requests?query=(itemId=="${value}" and (status))`;

      expect(urls.requestsForItem(value)).toBe(expectedUrl);
    });

    it('should return url to get requests for instance data', () => {
      const expectedUrl = `circulation/requests?query=(instanceId=="${value}" and (status))`;

      expect(urls.requestsForInstance(value)).toBe(expectedUrl);
    });
  });
});
