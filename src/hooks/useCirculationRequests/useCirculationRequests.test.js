import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import {
  getItems,
  getRequests,
} from './useCirculationRequests';
import { MAX_RECORDS } from '../../constants';

jest.mock('../../utils', () => ({
  getStatusQuery: jest.fn(() => 'status'),
}));

describe('useCirculationRequests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getItems', () => {
    const instanceId = 'instanceId';
    const get = jest.fn(() => ({ json: jest.fn() }));
    const ky = { get };

    it('should trigger ky.get with correct arguments', () => {
      const expectedArgs = [
        'circulation/items-by-instance',
        {
          searchParams: {
            query: `id==${instanceId}`,
          }
        }
      ];

      getItems(ky, instanceId);

      expect(get).toHaveBeenCalledWith(...expectedArgs);
    });
  });

  describe('getRequests', () => {
    const instanceId = 'instanceId';
    const get = jest.fn()
      .mockImplementationOnce(() => ({
        json: () => ({
          items: [{ id: 'itemId' }],
        })
      }))
      .mockImplementationOnce(() => ({
        json: () => ({
          requests: [],
        })
      }));
    const ky = { get };

    it('should trigger ky.get with correct arguments', async () => {
      const expectedArgs = [
        'circulation/requests',
        {
          searchParams: {
            query: '(itemId==itemId) and (status)',
            limit: MAX_RECORDS,
          }
        }
      ];

      getRequests(ky, instanceId);

      await waitFor(() => {
        expect(get).toHaveBeenCalledWith(...expectedArgs);
      });
    });
  });
});
