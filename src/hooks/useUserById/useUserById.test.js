import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import useUserById from './useUserById';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = {
  users: [{ id: 'id' }],
};

describe('useUserById', () => {
  it('should fetch data', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ data }),
      }),
    });

    const { result } = renderHook(() => useUserById('userId', false), { wrapper });

    await waitFor(() => {
      expect(result.current.userData.data).toEqual(data);
    });
  });
});
