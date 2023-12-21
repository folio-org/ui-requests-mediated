import React from 'react';
import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';
import { FormattedMessage } from 'react-intl';

import '../../../test/jest/__mock__';
import GreetingModal from './greeting-modal';

const label = <FormattedMessage id="ui-requests-mediated.new-app.greeting" />;

const renderGreetingModal = () => {
  return render(
    <GreetingModal />
  );
};

describe('Greeting Modal', () => {
  let page;

  beforeEach(() => {
    page = renderGreetingModal();
  });

  afterEach(cleanup);

  it('should be rendered', () => {
    const { container } = page;
    const content = container.querySelector('[data-test-greeting-modal]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();
    expect(content.innerHtml).toEqual(label.innerHtml);
  });
});
