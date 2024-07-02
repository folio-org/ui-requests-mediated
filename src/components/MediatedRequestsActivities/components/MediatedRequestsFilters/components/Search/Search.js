import {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import { isEmpty } from 'lodash';

import {
  Button,
  SearchField,
  Icon,
} from '@folio/stripes/components';

import {
  ICONS,
  MEDIATED_REQUEST_FILTER_TYPES,
  MEDIATED_REQUEST_LEVEL_PROP_TYPES,
  MEDIATED_REQUEST_STATUS_PROP_TYPES,
} from '../../../../../../constants';

import styles from './Search.css';

const Search = ({
  getSearchHandlers,
  searchValue,
  resetAll,
  activeFilters,
}) => {
  const handleChange = useCallback((e) => {
    if (e.target.value) {
      getSearchHandlers().query(e);
    } else {
      getSearchHandlers().reset();
    }
  }, [getSearchHandlers]);

  const isResetButtonDisabled = !searchValue.query
    && isEmpty(activeFilters[MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS])
    && isEmpty(activeFilters[MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS]);

  return (
    <div
      className={styles.searchFieldContainer}
    >
      <SearchField
        data-testid="mediatedRequestsActivitiesSearch"
        autoFocus
        autoComplete="off"
        name="query"
        className={styles.searchField}
        marginBottom0
        onChange={handleChange}
        value={searchValue.query}
      />
      <Button
        data-testid="mediatedRequestsActivitiesSearchButton"
        type="submit"
        buttonStyle="primary"
        fullWidth
        disabled={!searchValue.query}
      >
        <FormattedMessage id="stripes-smart-components.search" />
      </Button>
      <Button
        buttonStyle="none"
        buttonClass={styles.resetButton}
        disabled={isResetButtonDisabled}
        onClick={resetAll}
      >
        <Icon
          icon={ICONS.TIMES_CIRCLE_SOLID}
          size="small"
        >
          <FormattedMessage id="stripes-smart-components.resetAll" />
        </Icon>
      </Button>
    </div>
  );
};

Search.propTypes = {
  activeFilters: PropTypes.shape({
    ...MEDIATED_REQUEST_STATUS_PROP_TYPES,
    ...MEDIATED_REQUEST_LEVEL_PROP_TYPES,
  }).isRequired,
  searchValue: PropTypes.shape({
    query: PropTypes.string.isRequired,
  }).isRequired,
  getSearchHandlers: PropTypes.func.isRequired,
  resetAll: PropTypes.func.isRequired,
};

export default Search;
