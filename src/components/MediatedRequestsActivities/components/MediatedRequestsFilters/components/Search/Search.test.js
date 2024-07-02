import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  SearchField,
} from '@folio/stripes/components';

import Search from './Search';

const testIds = {
  mediatedRequestsActivitiesSearch: 'mediatedRequestsActivitiesSearch',
  mediatedRequestsActivitiesSearchButton: 'mediatedRequestsActivitiesSearchButton',
};

describe('Search', () => {
  const querySpy = jest.fn();
  const resetSpy = jest.fn();
  const initialProps = {
    getSearchHandlers: () => ({
      query: querySpy,
      reset: resetSpy,
    }),
    searchValue: {
      query: '',
    },
    resetAll: jest.fn(),
    activeFilters: jest.fn(),
  };

  describe('when search input does not have initial value', () => {
    beforeEach(() => {
      render(
        <Search {...initialProps} />
      );
    });

    it('should render search field', () => {
      expect(screen.getByTestId(testIds.mediatedRequestsActivitiesSearch)).toBeInTheDocument();
    });

    it('should render search field with correct props', () => {
      const expectedProps = {
        autoFocus: true,
        autoComplete: 'off',
        name: 'query',
        'data-testid': testIds.mediatedRequestsActivitiesSearch,
        onChange: expect.any(Function),
        value: initialProps.searchValue.query,
      };

      expect(SearchField).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
    });

    it('should render button', () => {
      expect(screen.getByTestId(testIds.mediatedRequestsActivitiesSearchButton)).toBeInTheDocument();
    });

    it('button should be disabled', () => {
      expect(screen.getByTestId(testIds.mediatedRequestsActivitiesSearchButton)).toBeDisabled();
    });

    it('should trigger query method', () => {
      const event = {
        target: {
          value: 'test',
        },
      };

      fireEvent.change(screen.getByTestId(testIds.mediatedRequestsActivitiesSearch), event);

      expect(querySpy).toHaveBeenCalled();
    });
  });

  describe('when search input has initial value', () => {
    const props = {
      ...initialProps,
      searchValue: {
        query: 'test',
      },
    };

    beforeEach(() => {
      render(
        <Search {...props} />
      );
    });

    it('button should not be disabled', () => {
      expect(screen.getByTestId(testIds.mediatedRequestsActivitiesSearchButton)).not.toBeDisabled();
    });

    it('should trigger reset method', () => {
      const event = {
        target: {
          value: '',
        },
      };

      fireEvent.change(screen.getByTestId(testIds.mediatedRequestsActivitiesSearch), event);

      expect(resetSpy).toHaveBeenCalled();
    });
  });
});
