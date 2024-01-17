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

const SendItemInTransit = () => {
  return (
    <Paneset data-testid="sendItemInTransitPaneSet">
      <Pane
        data-testid="sendItemInTransitPane"
        defaultWidth={FILTER_PANE_WIDTH}
        paneTitle={<FormattedMessage id="ui-requests-mediated.app.filterPane.selectActivity" />}
      >
        <NavigationMenu value={getSendItemInTransitUrl()} />
      </Pane>
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-requests-mediated.app.sendItemInTransit.paneTitle" />}
      />
    </Paneset>
  );
};

export default SendItemInTransit;
