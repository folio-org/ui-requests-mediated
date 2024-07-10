import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  CheckboxFilter,
} from '@folio/stripes/smart-components';

import {
  transformRequestFilterOptions,
} from '../../../../../../utils';
import {
  MEDIATED_REQUEST_FILTER_TYPES,
  MEDIATED_REQUEST_LEVEL_PROP_TYPES,
  MEDIATED_REQUEST_LEVEL_TRANSLATIONS,
} from '../../../../../../constants';

const MediatedRequestLevelFilter = ({
  activeFilters,
  resultOffset,
  onChangeHandlers,
  onChangeHandlers: {
    clearGroup,
  },
}) => {
  const { formatMessage } = useIntl();
  const filterPath = MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS;
  const activeValues = activeFilters[filterPath];
  const handleFilterChange = (filter) => {
    if (resultOffset) {
      resultOffset.replace(0);
    }

    onChangeHandlers.state({
      ...activeFilters,
      [filter.name]: filter.values
    });
  };
  const onClearFilter = () => clearGroup(filterPath);

  return (
    <AccordionSet
      data-testid={`${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}Set`}
    >
      <Accordion
        id={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}
        data-testid={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}
        header={FilterAccordionHeader}
        label={formatMessage({ id:'ui-requests-mediated.filters.mediatedRequestLevel.accordionTitle' })}
        name={filterPath}
        separator={false}
        displayClearButton={!isEmpty(activeValues)}
        onClearFilter={onClearFilter}
      >
        <CheckboxFilter
          data-testid={`${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}Filter`}
          dataOptions={transformRequestFilterOptions(formatMessage, MEDIATED_REQUEST_LEVEL_TRANSLATIONS)}
          name={filterPath}
          selectedValues={activeFilters[filterPath]}
          onChange={handleFilterChange}
        />
      </Accordion>
    </AccordionSet>
  );
};

MediatedRequestLevelFilter.propTypes = {
  activeFilters: PropTypes.shape({
    ...MEDIATED_REQUEST_LEVEL_PROP_TYPES,
  }).isRequired,
  onChangeHandlers: PropTypes.shape({
    clearGroup: PropTypes.func.isRequired,
    state: PropTypes.func.isRequired,
  }).isRequired,
  resultOffset: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default MediatedRequestLevelFilter;
