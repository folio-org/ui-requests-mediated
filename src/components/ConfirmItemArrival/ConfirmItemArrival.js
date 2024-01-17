import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';

import NavigationMenu from '../NavigationMenu';

import {
  FILTER_PANE_WIDTH,
  getConfirmItemArrivalUrl,
} from '../../constants';

const ConfirmItemArrival = () => {
  return (
    <Paneset data-testid="confirmItemArrivalPaneSet">
      <Pane
        data-testid="confirmItemArrivalPane"
        defaultWidth={FILTER_PANE_WIDTH}
        paneTitle={<FormattedMessage id="ui-requests-mediated.app.filterPane.selectActivity" />}
      >
        <NavigationMenu value={getConfirmItemArrivalUrl()} />
      </Pane>
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-requests-mediated.app.confirmItemArrival.paneTitle" />}
      />
    </Paneset>
  );
};

export default ConfirmItemArrival;
