import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';

export default class MediatedRequests extends React.Component {
  render() {
    return (
      <Paneset data-testid="mediatedRequestsPaneSet">
        <Pane
          data-testid="mediatedRequestsPane"
          defaultWidth="fill"
          fluidContentWidth
          paneTitle={<FormattedMessage id="ui-requests-mediated.app.index.paneTitle" />}
        />
      </Paneset>
    );
  }
}
