import {
  useIntl,
} from 'react-intl';

import {
  Accordion,
} from '@folio/stripes/components';
import {
  CheckboxFilter,
} from '@folio/stripes/smart-components';
import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestStatusFilter from './MediatedRequestStatusFilter';

import {
  MEDIATED_REQUEST_FILTER_TYPES,
  MEDIATED_REQUEST_STATUS_TRANSLATIONS,
} from '../../../../../../constants';
import { transformRequestFilterOptions } from '../../../../../../utils';


const testIds = {
  accordionSet: `${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}Set`,
  accordion: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS,
  checkboxFilter: `${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}Filter`,
  checkboxFilterButton: `${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}FilterButton`,
};
const labelIds = {
  accordionLabel: 'ui-requests-mediated.filters.mediatedRequestStatus.accordionTitle',
};

describe('MediatedRequestStatusFilter', () => {
  const { formatMessage } = useIntl();
  const activeFiltersValue = 'status';
  const activeFilters = {
    status: [activeFiltersValue],
  };
  const replace = jest.fn();
  const resultOffset = {
    replace,
  };
  const clearGroup = jest.fn();
  const state = jest.fn();
  const onChangeHandlers = {
    clearGroup,
    state,
  };

  beforeEach(() => {
    render(
      <MediatedRequestStatusFilter
        activeFilters={activeFilters}
        resultOffset={resultOffset}
        onChangeHandlers={onChangeHandlers}
      />
    );
  });

  it('should render accordion set', () => {
    expect(screen.getByTestId(testIds.accordionSet)).toBeInTheDocument();
  });

  it('should render accordion', () => {
    expect(screen.getByTestId(testIds.accordion)).toBeInTheDocument();
  });

  it('should render accordion with correct props', () => {
    const expectedProps = {
      id: 'status',
      'data-testid': testIds.accordion,
      label: labelIds.accordionLabel,
      name: 'status',
      separator: false,
      displayClearButton: true,
      onClearFilter: expect.any(Function),
    };

    expect(Accordion).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
  });

  it('should handle accordion clear filters', () => {
    expect(clearGroup).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId(`${testIds.accordion}Button`));

    expect(clearGroup).toHaveBeenCalledWith(activeFiltersValue);
  });

  it('should render checkbox filter', () => {
    expect(screen.getByTestId(testIds.checkboxFilter)).toBeInTheDocument();
  });

  it('should render checkbox filter with correct props', () => {
    const expectedProps = {
      'data-testid': testIds.checkboxFilter,
      onChange: expect.any(Function),
      dataOptions: transformRequestFilterOptions(formatMessage, MEDIATED_REQUEST_STATUS_TRANSLATIONS),
      name: activeFiltersValue,
      selectedValues: [activeFiltersValue],
    };

    expect(CheckboxFilter).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
  });

  it('should handle checkbox filter on change', () => {
    expect(replace).not.toHaveBeenCalled();
    expect(state).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId(testIds.checkboxFilterButton));

    expect(replace).toHaveBeenCalledWith(0);
    expect(state).toHaveBeenCalledWith({ ...activeFilters });
  });
});
