import React from 'react';
import { Router } from 'react-router-dom';
import {
  render,
  cleanup,
} from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { FormattedMessage } from 'react-intl';

import '../../../test/jest/__mock__';
import NewAppGreeting from './new-app-greeting';

const label = <FormattedMessage id="ui-requests-mediated.new-app.greeting" />;

const renderGreetingPage = () => {
  const history = createMemoryHistory();
  return render(
    <Router history={history}>
      <NewAppGreeting />
    </Router>
  );
};

describe('Greeting Page', () => {
  let page;

  beforeEach(() => {
    page = renderGreetingPage();
  });

  afterEach(cleanup);

  it('should be rendered', () => {
    const { container } = page;
    const content = container.querySelector('[data-test-application-greeting]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();
    expect(content.innerHtml).toEqual(label.innerHtml);
  });
});
