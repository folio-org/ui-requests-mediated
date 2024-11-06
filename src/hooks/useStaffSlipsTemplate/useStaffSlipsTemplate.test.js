import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useStaffSlipsTemplate from './useStaffSlipsTemplate';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = {
  a: 'a',
  b: 'b',
};

describe('useStaffSlipsTemplate', () => {
  it('should fetch data', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          data,
        }),
      }),
    });

    const { result } = renderHook(() => useStaffSlipsTemplate(true), { wrapper });

    await act(() => {
      return !result.current.isLoading;
    });

    expect(result.current).toStrictEqual({
      data,
      isFetching: false,
    });
  });
});
