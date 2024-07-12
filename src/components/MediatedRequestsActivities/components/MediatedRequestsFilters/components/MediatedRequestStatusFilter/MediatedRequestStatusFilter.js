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
  MEDIATED_REQUEST_STATUS_PROP_TYPES,
  MEDIATED_REQUEST_STATUS_TRANSLATIONS,
} from '../../../../../../constants';

const MediatedRequestStatusFilter = ({
  activeFilters,
  resultOffset,
  onChangeHandlers,
  onChangeHandlers: {
    clearGroup,
  },
}) => {
  const { formatMessage } = useIntl();
  const filterPath = MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS;
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
      data-testid={`${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}Set`}
    >
      <Accordion
        id={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}
        data-testid={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}
        header={FilterAccordionHeader}
        label={formatMessage({ id:'ui-requests-mediated.filters.mediatedRequestStatus.accordionTitle' })}
        name={filterPath}
        separator={false}
        displayClearButton={!isEmpty(activeValues)}
        onClearFilter={onClearFilter}
      >
        <CheckboxFilter
          data-testid={`${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}Filter`}
          dataOptions={transformRequestFilterOptions(formatMessage, MEDIATED_REQUEST_STATUS_TRANSLATIONS)}
          name={filterPath}
          selectedValues={activeFilters[filterPath]}
          onChange={handleFilterChange}
        />
      </Accordion>
    </AccordionSet>
  );
};

MediatedRequestStatusFilter.propTypes = {
  activeFilters: PropTypes.shape({
    ...MEDIATED_REQUEST_STATUS_PROP_TYPES,
  }).isRequired,
  onChangeHandlers: PropTypes.shape({
    clearGroup: PropTypes.func.isRequired,
    state: PropTypes.func.isRequired,
  }).isRequired,
  resultOffset: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default MediatedRequestStatusFilter;
