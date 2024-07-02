import { render } from '@folio/jest-config-stripes/testing-library/react';
import {
  checkScope,
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import RequestsFormShortcutsWrapper, {
  getKeyCommands,
} from './RequestFormShortcutsWrapper';
import { handleKeyCommand } from '../../../../utils';

jest.mock('../../../../utils', () => ({
  handleKeyCommand: jest.fn(),
}));

const basicProps = {
  children: <div/>,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  accordionStatusRef: {},
  isSubmittingDisabled: true,
};

describe('RequestsFormShortcutsWrapper', () => {
  it('should trigger HasCommand with correct props', () => {
    const expectedProps = {
      commands: expect.any(Array),
      isWithinScope: checkScope,
      scope: document.body,
    };

    render(
      <RequestsFormShortcutsWrapper
        {...basicProps}
      />
    );

    expect(HasCommand).toHaveBeenCalledWith(expect.objectContaining(expectedProps), {});
  });

  describe('getKeyCommands', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const ref = {};
    const isDisabled = true;
    const event = {};
    const commands = getKeyCommands(onSubmit, onCancel, ref, isDisabled);

    it('should handle save', () => {
      const expectedArgs = [onSubmit, { disabled: isDisabled }];

      expect(handleKeyCommand).toHaveBeenCalledWith(...expectedArgs);
    });

    it('should handle cancel', () => {
      expect(handleKeyCommand).toHaveBeenCalledWith(onCancel);
    });

    it('should handle sections expanding', () => {
      const expectedArgs = [event, ref];

      commands[1].handler(event);

      expect(expandAllSections).toHaveBeenCalledWith(...expectedArgs);
    });

    it('should handle sections collapsing', () => {
      const expectedArgs = [event, ref];

      commands[2].handler(event);

      expect(collapseAllSections).toHaveBeenCalledWith(...expectedArgs);
    });
  });
});
