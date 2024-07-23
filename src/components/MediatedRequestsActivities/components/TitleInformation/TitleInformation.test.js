import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import TitleInformation from './TitleInformation';

const basicProps = {
  instanceId: 'instanceId',
  title: 'title',
  contributors: [{ name: 'Contributor' }],
  publications: [{ dateOfPublication: '2021' }],
  editions: [{ name: 'Edition' }],
  identifiers: [{ value: 'identifier' }],
};
const labelIds = {
  title: 'ui-requests-mediated.instanceDetails.title',
  contributor: 'ui-requests-mediated.instanceDetails.contributor',
  publicationsDate: 'ui-requests-mediated.instanceDetails.publicationDate',
  edition: 'ui-requests-mediated.instanceDetails.edition',
  identifiers: 'ui-requests-mediated.instanceDetails.identifiers',
};

jest.mock('react-router-dom', () => ({
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

describe('TitleInformation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    render(
      <TitleInformation
        {...basicProps}
      />
    );
  });

  it('should render instance title label', () => {
    const instanceTitleLabel = screen.getByText(labelIds.title);

    expect(instanceTitleLabel).toBeInTheDocument();
  });

  it('should render instance title value', () => {
    const instanceTitleValue = screen.getByText(basicProps.title);

    expect(instanceTitleValue).toBeInTheDocument();
  });

  it('should render contributor label', () => {
    const contributorLabel = screen.getByText(labelIds.contributor);

    expect(contributorLabel).toBeInTheDocument();
  });

  it('should render contributor value', () => {
    const contributorValue = screen.getByText(basicProps.contributors[0].name);

    expect(contributorValue).toBeInTheDocument();
  });

  it('should render publication date label', () => {
    const publicationsDateLabel = screen.getByText(labelIds.publicationsDate);

    expect(publicationsDateLabel).toBeInTheDocument();
  });

  it('should render publications date value', () => {
    const publicationsDateValue = screen.getByText(basicProps.publications[0].dateOfPublication);

    expect(publicationsDateValue).toBeInTheDocument();
  });

  it('should render edition label', () => {
    const editionLabel = screen.getByText(labelIds.edition);

    expect(editionLabel).toBeInTheDocument();
  });

  it('should render edition value', () => {
    const editionValue = screen.getByText(basicProps.editions[0].name);

    expect(editionValue).toBeInTheDocument();
  });

  it('should render identifiers label', () => {
    const identifiersLabel = screen.getByText(labelIds.identifiers);

    expect(identifiersLabel).toBeInTheDocument();
  });

  it('should render identifiers value', () => {
    const identifiersValue = screen.getByText(basicProps.identifiers[0].value);

    expect(identifiersValue).toBeInTheDocument();
  });
});
