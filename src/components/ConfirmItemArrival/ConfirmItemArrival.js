import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
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

export default class ConfirmItemArrival extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
  };

  render() {
    const {
      history,
      location,
    } = this.props;

    return (
      <Paneset data-testid="confirmItemArrivalPaneSet">
        <Pane
          data-testid="confirmItemArrivalPane"
          defaultWidth={FILTER_PANE_WIDTH}
          paneTitle={<FormattedMessage id="ui-requests-mediated.app.filterPane.selectActivity" />}
        >
          <NavigationMenu
            history={history}
            location={location}
            value={getConfirmItemArrivalUrl()}
          />
        </Pane>
        <Pane
          defaultWidth="fill"
          paneTitle={<FormattedMessage id="ui-requests-mediated.app.confirmItemArrival.paneTitle" />}
        />
      </Paneset>
    );
  }
}
