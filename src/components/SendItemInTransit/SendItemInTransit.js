import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';

import NavigationMenu from '../NavigationMenu';

import {
  FILTER_PANE_WIDTH,
  getSendItemInTransitUrl,
} from '../../constants';

const SendItemInTransit = ({
  history,
  location,
}) => {
  return (
    <Paneset data-testid="sendItemInTransitPaneSet">
      <Pane
        data-testid="sendItemInTransitPane"
        defaultWidth={FILTER_PANE_WIDTH}
        paneTitle={<FormattedMessage id="ui-requests-mediated.app.filterPane.selectActivity" />}
      >
        <NavigationMenu
          history={history}
          location={location}
          value={getSendItemInTransitUrl()}
        />
      </Pane>
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-requests-mediated.app.sendItemInTransit.paneTitle" />}
      />
    </Paneset>
  );
};

SendItemInTransit.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default SendItemInTransit;
