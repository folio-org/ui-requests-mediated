import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import {
  getConfirmItemArrivalUrl,
  getMediatedRequestsActivitiesUrl,
  getSendItemInTransitUrl,
} from '../../constants';

export const getDataOptions = (intl) => ([
  {
    label: intl.formatMessage({ id: 'ui-requests-mediated.app.mediatedRequestsActivities.navigation' }),
    value: getMediatedRequestsActivitiesUrl(),
  },
  {
    label: intl.formatMessage({ id: 'ui-requests-mediated.app.confirmItemArrival.navigation' }),
    value: getConfirmItemArrivalUrl(),
  },
  {
    label: intl.formatMessage({ id: 'ui-requests-mediated.app.sendItemInTransit.navigation' }),
    value: getSendItemInTransitUrl(),
  },
]);

export const handleChangeMenu = (event, location, history) => {
  const pathname = event.target.value;
  const destination = {
    pathname,
    state: location.state,
  };

  if (pathname === getMediatedRequestsActivitiesUrl()) {
    destination.search = location.state;
  } else {
    destination.state = location.search;
  }

  history.push(destination);
};

const NavigationMenu = ({
  history,
  location,
  value,
}) => {
  const intl = useIntl();

  return (
    <Select
      data-testid="navigationMenu"
      value={value}
      dataOptions={getDataOptions(intl)}
      onChange={(event) => handleChangeMenu(event, location, history)}
    />
  );
};

NavigationMenu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
};

export default NavigationMenu;
