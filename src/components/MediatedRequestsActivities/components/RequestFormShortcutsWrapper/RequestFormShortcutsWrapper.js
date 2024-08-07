import PropTypes from 'prop-types';

import {
  checkScope,
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { handleKeyCommand } from '../../../../utils';

export const getKeyCommands = (onSubmit, onCancel, accordionStatusRef, isSubmittingDisabled) => {
  return [
    {
      name: 'save',
      handler: handleKeyCommand(onSubmit, { disabled: isSubmittingDisabled }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
    }
  ];
};

const RequestFormShortcutsWrapper = ({
  children,
  onSubmit,
  onCancel,
  accordionStatusRef,
  isSubmittingDisabled,
}) => {
  const keyCommands = getKeyCommands(onSubmit, onCancel, accordionStatusRef, isSubmittingDisabled);

  return (
    <HasCommand
      commands={keyCommands}
      isWithinScope={checkScope}
      scope={document.body}
    >
      {children}
    </HasCommand>
  );
};

RequestFormShortcutsWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  accordionStatusRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  isSubmittingDisabled: PropTypes.bool.isRequired,
};

export default RequestFormShortcutsWrapper;
