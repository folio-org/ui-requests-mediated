import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Select,
} from '@folio/stripes/components';

import {
  getConfirmItemArrivalUrl,
  getMediatedRequestsActionsUrl,
  getSendItemInTransitUrl,
} from '../../constants';

import css from './NavigationMenu.css';

const NavigationMenu = ({
  history,
  location,
  value,
  dataOptions,
  separator,
}) => {
  const intl = useIntl();

  const defaultOptions = [
    {
      label: intl.formatMessage({ id: 'ui-requests-mediated.app.mediatedRequestsActions.navigation' }),
      value: getMediatedRequestsActionsUrl(),
    },
    {
      label: intl.formatMessage({ id: 'ui-requests-mediated.app.confirmItemArrival.navigation' }),
      value: getConfirmItemArrivalUrl(),
    },
    {
      label: intl.formatMessage({ id: 'ui-requests-mediated.app.sendItemInTransit.navigation' }),
      value: getSendItemInTransitUrl(),
    },
  ];

  const handleChangeMenu = (event) => {
    const pathname = event.target.value;
    const destination = {
      pathname,
      state: location.state,
    };

    if (pathname === getMediatedRequestsActionsUrl()) {
      destination.search = location.state;
    } else {
      destination.state = location.search;
    }

    history.push(destination);
  };

  return (
    <>
      <Select
        value={value}
        dataOptions={dataOptions || defaultOptions}
        onChange={handleChangeMenu}
      />
      {separator &&
        <div
          className={css.separator}
          data-testid="separator"
        />
      }
    </>
  );
};

NavigationMenu.defaultProps = {
  value: getMediatedRequestsActionsUrl(),
};

NavigationMenu.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.object.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  separator: PropTypes.bool,
  value: PropTypes.string,
};

export default NavigationMenu;
