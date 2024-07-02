import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ClipCopy: jest.fn(() => <div />),
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
  SearchAndSortNoResultsMessage: jest.fn((props) => (<div {...props} />)),
  ViewMetaData: jest.fn(({ metadata, ...rest }) => (
    <div {...rest}>{metadata.createdDate}</div>
  )),
  SearchAndSortQuery: ({
    children,
    'data-testid': testId,
  }) => (
    typeof children === 'function'
      ? <div data-testid={testId}>{ children() }</div>
      : <div data-testid={testId}>{ children }</div>
  ),
}));
