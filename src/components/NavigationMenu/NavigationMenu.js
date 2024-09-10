import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import { Select } from '@folio/stripes/components';

import {
  getConfirmItemArrivalUrl,
  getMediatedRequestsActivitiesUrl,
  getSendItemInTransitUrl,
} from '../../constants';

import styles from './NavigationMenu.css';

export const getDataOptions = (intl, stripes) => {
  const dataOptions = [];

  if (stripes.hasPerm('ui-requests-mediated.view')) {
    dataOptions.push({
      label: intl.formatMessage({ id: 'ui-requests-mediated.app.mediatedRequestsActivities.navigation' }),
      value: getMediatedRequestsActivitiesUrl(),
    });
  }

  if (stripes.hasPerm('ui-requests-mediated.confirm-item-arrival')) {
    dataOptions.push({
      label: intl.formatMessage({ id: 'ui-requests-mediated.app.confirmItemArrival.navigation' }),
      value: getConfirmItemArrivalUrl(),
    });
  }

  if (stripes.hasPerm('ui-requests-mediated.send-item-in-transit')) {
    dataOptions.push({
      label: intl.formatMessage({ id: 'ui-requests-mediated.app.sendItemInTransit.navigation' }),
      value: getSendItemInTransitUrl(),
    });
  }

  return dataOptions;
};

export const isNavigationMenuDisabled = (stripes) => (
  !stripes.hasPerm('ui-requests-mediated.confirm-item-arrival') && !stripes.hasPerm('ui-requests-mediated.send-item-in-transit')
);

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
  value,
  separator = false,
}) => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const stripes = useStripes();

  return (
    <>
      <Select
        data-testid="navigationMenu"
        value={value}
        disabled={isNavigationMenuDisabled(stripes)}
        dataOptions={getDataOptions(intl, stripes)}
        onChange={(event) => handleChangeMenu(event, location, history)}
      />
      { separator &&
        <hr className={styles.separator} />
      }
    </>
  );
};

NavigationMenu.propTypes = {
  value: PropTypes.string.isRequired,
  separator: PropTypes.bool,
};

export default NavigationMenu;
