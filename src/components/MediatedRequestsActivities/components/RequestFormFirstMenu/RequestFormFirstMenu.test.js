import { render } from '@folio/jest-config-stripes/testing-library/react';
import { PaneHeaderIconButton } from '@folio/stripes/components';

import RequestFormFirstMenu from './RequestFormFirstMenu';
import { ICON_TYPES } from '../../../../constants';

const defaultProps = {
  onCancel: jest.fn(),
};
const labelIds = {
  closeRequest: 'ui-requests-mediated.form.closeRequest',
};

describe('RequestFormFirstMenu', () => {
  beforeEach(() => {
    render(
      <RequestFormFirstMenu
        {...defaultProps}
      />
    );
  });

  it('should trigger PaneHeaderIconButton with correct props', () => {
    const expectedProps = {
      onClick: defaultProps.onCancel,
      ariaLabel: labelIds.closeRequest,
      icon: ICON_TYPES.TIMES,
    };

    expect(PaneHeaderIconButton).toHaveBeenCalledWith(expectedProps, {});
  });
});
