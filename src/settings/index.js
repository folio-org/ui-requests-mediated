import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import General from './General';

export default class MediatedRequestsSettings extends React.Component {
  pages = [
    {
      route: 'general',
      label: <FormattedMessage id="ui-requests-mediated.settings.general" />,
      component: General,
    },
  ];

  render() {
    return (
      <Settings
        {...this.props}
        pages={this.pages}
        paneTitle={<FormattedMessage id="ui-requests-mediated.settings.index.paneTitle" />}
      />
    );
  }
}
