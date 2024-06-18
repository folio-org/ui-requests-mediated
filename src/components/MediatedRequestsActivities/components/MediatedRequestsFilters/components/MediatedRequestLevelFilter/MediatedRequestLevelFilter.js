import { useIntl } from 'react-intl';

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
  MEDIATED_REQUEST_LEVEL_TRANSLATIONS,
} from '../../../../../../constants';

const MediatedRequestLevelFilter = () => {
  const { formatMessage } = useIntl();

  return (
    <AccordionSet
      data-testid={`${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}Set`}
    >
      <Accordion
        id={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}
        data-testid={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}
        header={FilterAccordionHeader}
        label={formatMessage({ id:'ui-requests-mediated.filters.mediatedRequestLevel.accordionTitle' })}
        name={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}
        separator={false}
        onClearFilter={() => {}}
      >
        <CheckboxFilter
          data-testid={`${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}Filter`}
          dataOptions={transformRequestFilterOptions(MEDIATED_REQUEST_LEVEL_TRANSLATIONS, formatMessage)}
          name={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_LEVELS}
          onChange={() => {}}
        />
      </Accordion>
    </AccordionSet>
  );
};

export default MediatedRequestLevelFilter;
