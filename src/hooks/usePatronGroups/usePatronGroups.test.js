import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import usePatronGroups from './usePatronGroups';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = {
  usergroups: ['test'],
};

describe('usePatronGroups', () => {
  it('should fetch data', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ data }),
      }),
    });

    const { result } = renderHook(() => usePatronGroups(true), { wrapper });

    await waitFor(() => {
      expect(result.current.patronGroups.data).toEqual(data);
    });
  });
});
