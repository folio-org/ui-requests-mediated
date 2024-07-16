import {
  MemoryRouter,
} from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestsDetail from './MediatedRequestsDetail';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({ pathname: '' })),
  useHistory: jest.fn(),
}));

jest.mock('../../../../hooks', () => ({
  useMediatedRequestById: jest.fn(() => ({ mediatedRequest: {} })),
}));

const testIds = {
  mediatedRequestsDetailPane: 'mediatedRequestsDetailPane',
};

describe('MediatedRequestsDetail', () => {
  const props = {
    stripes: {
      hasPerm: jest.fn(),
    },
  };
  beforeEach(() => {
    render(
      <MemoryRouter>
        <MediatedRequestsDetail
          {...props}
        />
      </MemoryRouter>
    );
  });

  it('should render pane', () => {
    expect(screen.getByTestId(testIds.mediatedRequestsDetailPane)).toBeInTheDocument();
  });
});
