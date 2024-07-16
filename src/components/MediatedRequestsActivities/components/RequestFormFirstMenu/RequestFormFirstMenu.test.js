import { render } from '@folio/jest-config-stripes/testing-library/react';
import { PaneHeaderIconButton } from '@folio/stripes/components';

import RequestFormFirstMenu from './RequestFormFirstMenu';
import { ICONS } from '../../../../constants';

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
      icon: ICONS.TIMES,
    };

    expect(PaneHeaderIconButton).toHaveBeenCalledWith(expectedProps, {});
  });
});
