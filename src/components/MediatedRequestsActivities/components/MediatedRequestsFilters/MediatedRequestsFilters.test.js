import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestsFilters from './MediatedRequestsFilters';
import {
  MediatedRequestStatusFilter,
  Search,
} from './components';

jest.mock('./components', () => ({
  MediatedRequestLevelFilter: jest.fn((props) => (<div {...props} />)),
  MediatedRequestStatusFilter: jest.fn((props) => (<div {...props} />)),
  Search: jest.fn((props) => (<div {...props} />)),
}));

jest.mock('../../../../hooks', () => ({
  useGeneralTlrSettings:  () => false,
}));

const testIds = {
  mediatedRequestsFiltersForm: 'MediatedRequestsFiltersForm',
  mediatedRequestsFiltersSearch: 'MediatedRequestsFiltersSearch',
  mediatedRequestFiltersStatusFilter: 'mediatedRequestFiltersStatusFilter',
  mediatedRequestFiltersLevelFilter: 'mediatedRequestFiltersLevelFilter',
};

describe('MediatedRequestsFilters', () => {
  beforeEach(() => {
    render(<MediatedRequestsFilters />);
  });

  it('should render form', () => {
    expect(screen.getByTestId(testIds.mediatedRequestsFiltersForm)).toBeInTheDocument();
  });

  it('should render search', () => {
    expect(screen.getByTestId(testIds.mediatedRequestsFiltersSearch)).toBeInTheDocument();
  });

  it('should trigger search with correct props', () => {
    expect(Search).toHaveBeenCalledWith(expect.objectContaining({}), {});
  });

  it('should render status filter', () => {
    expect(screen.getByTestId(testIds.mediatedRequestFiltersStatusFilter)).toBeInTheDocument();
  });

  it('should trigger status filter with correct props', () => {
    expect(MediatedRequestStatusFilter).toHaveBeenCalledWith(expect.objectContaining({}), {});
  });

  it('should not render level filter', () => {
    expect(screen.queryByTestId(testIds.mediatedRequestFiltersLevelFilter)).not.toBeInTheDocument();
  });
});
