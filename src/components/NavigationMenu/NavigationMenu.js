import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import { Select } from '@folio/stripes/components';

import {
  getConfirmItemArrivalUrl,
  getMediatedRequestsActivitiesUrl,
  getSendItemInTransitUrl,
} from '../../constants';

import styles from './NavigationMenu.css';

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
  value,
  separator,
}) => {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();

  return (
    <>
      <Select
        data-testid="navigationMenu"
        value={value}
        dataOptions={getDataOptions(intl)}
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

NavigationMenu.defaultProps = {
  separator: false,
};

export default NavigationMenu;
