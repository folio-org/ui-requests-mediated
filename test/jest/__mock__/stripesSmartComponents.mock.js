import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ClipCopy: jest.fn(() => <div />),
  NotesSmartAccordion: jest.fn(() => <div />),
  CollapseFilterPaneButton: jest.fn(({
    onClick,
    'data-testid': testId,
  }) => (
    <div data-testid={testId}>
      <button type="button" onClick={onClick}>
        onClick
      </button>
    </div>
  )),
  CheckboxFilter: jest.fn(({
    'data-testid': testId,
    onChange,
    ...rest
  }) => (
    <div
      {...rest}
      data-testid={testId}
    >
      <button
        type="button"
        onClick={onChange}
        data-testid={`${testId}Button`}
      >Change
      </button>
    </div>
  )),
  NoteCreatePage: jest.fn(props => <div {...props} />),
  NoteEditPage: jest.fn(props => <div {...props} />),
  NoteViewPage: jest.fn(props => (
    <div {...props}>
      <button
        onClick={props.onEdit}
        type="button"
      >
        Edit
      </button>
    </div>
  )),
  SearchAndSortNoResultsMessage: jest.fn((props) => (<div {...props} />)),
  ViewMetaData: jest.fn(({ metadata, ...rest }) => (
    <div {...rest}>{metadata.createdDate}</div>
  )),
}));
