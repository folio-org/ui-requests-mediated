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
  MEDIATED_REQUEST_STATUS_TRANSLATIONS,
} from '../../../../../../constants';

const MediatedRequestStatusFilter = () => {
  const { formatMessage } = useIntl();

  return (
    <AccordionSet
      data-testid={`${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}Set`}
    >
      <Accordion
        id={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}
        data-testid={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}
        header={FilterAccordionHeader}
        label={formatMessage({ id:'ui-requests-mediated.filters.mediatedRequestStatus.accordionTitle' })}
        name={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}
        separator={false}
        onClearFilter={() => {}}
      >
        <CheckboxFilter
          data-testid={`${MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}Filter`}
          dataOptions={transformRequestFilterOptions(formatMessage, MEDIATED_REQUEST_STATUS_TRANSLATIONS)}
          name={MEDIATED_REQUEST_FILTER_TYPES.MEDIATED_REQUEST_STATUS}
          onChange={() => {}}
        />
      </Accordion>
    </AccordionSet>
  );
};

export default MediatedRequestStatusFilter;
