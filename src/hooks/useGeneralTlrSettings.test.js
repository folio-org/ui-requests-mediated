import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  act,
} from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import useGeneralTlrSettings from './useGeneralTlrSettings';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = 'data';

describe('useGeneralTlrSettings', () => {
  it('should fetch data', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          data,
        }),
      }),
    });

    const { result } = renderHook(() => useGeneralTlrSettings(), { wrapper });

    await act(() => {
      return !result.current.isLoading;
    });

    expect(result.current.settings.data).toBe(data);
  });
});
