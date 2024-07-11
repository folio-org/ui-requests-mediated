import { render } from '@folio/jest-config-stripes/testing-library/react';
import { PaneHeaderIconButton } from '@folio/stripes/components';

import RequestFormFirstMenu from './RequestFormFirstMenu';
import { ICON_TYPES } from '../../../../constants';

const basicProps = {
  onCancel: jest.fn(),
};

describe('RequestFormFirstMenu', () => {
  beforeEach(() => {
    render(
      <RequestFormFirstMenu
        {...basicProps}
      />
    );
  });

  it('should trigger PaneHeaderIconButton with correct props', () => {
    const expectedProps = {
      onClick: basicProps.onCancel,
      icon: ICON_TYPES.TIMES,
    };

    expect(PaneHeaderIconButton).toHaveBeenCalledWith(expectedProps, {});
  });
});
