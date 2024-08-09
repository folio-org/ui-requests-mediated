import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import ReferredRecord from './ReferredRecord';

jest.mock('react-router-dom', () => ({
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

const basicProps = {
  values: {
    instanceId: 'instanceId',
    instanceTitle: 'instanceTitle',
    itemBarcode: 'itemBarcode',
    itemId: 'itemId',
    holdingsRecordId: 'holdingsRecordId',
    requestCreateDate: 'requestCreateDate',
    requesterId: 'requesterId',
    requesterName: 'requesterName',
  },
};
const labelIds = {
  request: 'ui-requests-mediated.notes.entityType.request',
  assignedFor: 'ui-requests-mediated.notes.assigned.for',
  assignedRequester: 'ui-requests-mediated.notes.assigned.requester',
  assignedRequestDate: 'ui-requests-mediated.notes.assigned.requestDate',
};

describe('ReferredRecord', () => {
  beforeEach(() => {
    render(
      <ReferredRecord
        {...basicProps}
      />
    );
  });

  it('should render request label', () => {
    const requestLabel = screen.getByText(labelIds.request);

    expect(requestLabel).toBeInTheDocument();
  });

  it('should render assigned for label', () => {
    const assignedForLabel = screen.getByText(labelIds.assignedFor);

    expect(assignedForLabel).toBeInTheDocument();
  });

  it('should render requester label', () => {
    const assignedRequesterLabel = screen.getByText(labelIds.assignedRequester);

    expect(assignedRequesterLabel).toBeInTheDocument();
  });

  it('should render request date label', () => {
    const assignedRequestDateLabel = screen.getByText(labelIds.assignedRequestDate);

    expect(assignedRequestDateLabel).toBeInTheDocument();
  });
});
