import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane } from '@folio/stripes/components';

export default class General extends React.Component {
  static propTypes = {
    label: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Pane
        data-testid="generalPane"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={this.props.label}
      >
        <FormattedMessage id="ui-requests-mediated.settings.general.message" />
      </Pane>
    );
  }
}
