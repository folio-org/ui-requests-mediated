import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';

import NavigationMenu from '../NavigationMenu';

import {
  APP_ICON_NAME,
  FILTER_PANE_WIDTH,
  getMediatedRequestsActivitiesUrl,
} from '../../constants';

const MediatedRequestsActivities = () => {
  return (
    <Paneset data-testid="mediatedRequestsActivitiesPaneSet">
      <Pane
        data-testid="mediatedRequestsActivitiesPane"
        defaultWidth={FILTER_PANE_WIDTH}
        paneTitle={<FormattedMessage id="ui-requests-mediated.app.filterPane.selectActivity" />}
      >
        <NavigationMenu value={getMediatedRequestsActivitiesUrl()} />
      </Pane>
      <Pane
        defaultWidth="fill"
        appIcon={<AppIcon app={APP_ICON_NAME} />}
        paneTitle={<FormattedMessage id="ui-requests-mediated.app.mediatedRequestsActivities.paneTitle" />}
      />
    </Paneset>
  );
};

export default MediatedRequestsActivities;
