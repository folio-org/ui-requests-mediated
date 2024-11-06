import {
  render,
} from '@folio/jest-config-stripes/testing-library/react';

import ContentToPrint from './ContentToPrint';

describe('ContentToPrint', () => {
  const props = {
    contentToPrintId: 'contentToPrint',
    template: '<p></p>',
    dataSource: {
      requester: {},
      inTransitDate: '2024-12-31T24:00:00.000+00:00',
      staffSlipContext: {},
    },
  };

  beforeEach(() => {
    render(
      <ContentToPrint {...props} />
    );
  });

  it('should render component', () => {
    expect(document.querySelector('#contentToPrint')).toBeInTheDocument();
  });
});
