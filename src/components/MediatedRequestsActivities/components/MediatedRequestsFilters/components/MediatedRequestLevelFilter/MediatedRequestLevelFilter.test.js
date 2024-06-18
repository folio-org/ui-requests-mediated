import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import MediatedRequestLevelFilter from './MediatedRequestLevelFilter';

import { MEDIATED_REQUEST_FILTER_TYPES } from '../../../../../../constants';

const testIds = {
  accordionSet: `${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}Set`,
  accordion: MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS,
  checkboxFilter: `${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}Filter`,
};

describe('MediatedRequestLevelFilter', () => {
  beforeEach(() => {
    render(<MediatedRequestLevelFilter />);
  });

  it('should render accordion set', () => {
    expect(screen.getByTestId(testIds.accordionSet)).toBeInTheDocument();
  });

  it('should render accordion', () => {
    expect(screen.getByTestId(testIds.accordion)).toBeInTheDocument();
  });

  it('should render checkbox filter', () => {
    expect(screen.getByTestId(testIds.checkboxFilter)).toBeInTheDocument();
  });
});
