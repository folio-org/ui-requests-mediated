import {
  FormattedMessage,
} from 'react-intl';

import {
  Button,
  SearchField,
  Icon,
} from '@folio/stripes/components';

import {
  ICONS,
} from '../../../../../../constants';

import styles from './Search.css';

const Search = () => {
  return (
    <form
      onSubmit={() => {}}
      className={styles.searchForm}
    >
      <SearchField
        autoFocus
        autoComplete="off"
        name="query"
        className={styles.searchField}
        marginBottom0
      />
      <Button
        type="submit"
        buttonStyle="primary"
        fullWidth
      >
        <FormattedMessage id="stripes-smart-components.search" />
      </Button>
      <Button
        buttonStyle="none"
        buttonClass={styles.resetButton}
      >
        <Icon
          icon={ICONS.TIMES_CIRCLE_SOLID}
          size="small"
        >
          <FormattedMessage id="stripes-smart-components.resetAll" />
        </Icon>
      </Button>
    </form>
  );
};

export default Search;
