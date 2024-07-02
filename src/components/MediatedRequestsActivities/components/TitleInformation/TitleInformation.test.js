import { Link } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

jest.mock('react-router-dom', () => ({
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

import TitleInformation, {
  REQUEST_DATE,
} from './TitleInformation';
import {
  OPEN_REQUEST_STATUS_FILTERS,
  REQUEST_LEVEL_TYPES,
} from '../../../../constants';

const defaultProps = {
  instanceId: 'instanceId',
  titleLevelRequestsCount: 2,
  title: 'title',
  contributors: [{ name: 'Contributor' }],
  publications: [{ dateOfPublication: '2021' }],
  editions: [{ name: 'Edition' }],
  identifiers: [{ value: 'identifier' }],
};
const labelIds = {
  titleLevelRequests: 'ui-requests-mediated.instanceDetails.tlr',
  title: 'ui-requests-mediated.instanceDetails.title',
  contributor: 'ui-requests-mediated.instanceDetails.contributor',
  publicationsDate: 'ui-requests-mediated.instanceDetails.publicationDate',
  edition: 'ui-requests-mediated.instanceDetails.edition',
  identifiers: 'ui-requests-mediated.instanceDetails.identifiers',
};

describe('TitleInformation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When tlr amount is a link', () => {
    beforeEach(() => {
      render(
        <TitleInformation
          {...defaultProps}
        />
      );
    });

    it('should render tlr label', () => {
      const tlrLabel = screen.getByText(labelIds.titleLevelRequests);

      expect(tlrLabel).toBeInTheDocument();
    });

    it('should render tlr value', () => {
      const tlrValue = screen.queryByText(defaultProps.titleLevelRequestsCount);

      expect(tlrValue).toBeInTheDocument();
    });

    it('should render instance title label', () => {
      const instanceTitleLabel = screen.getByText(labelIds.title);

      expect(instanceTitleLabel).toBeInTheDocument();
    });

    it('should render instance title value', () => {
      const instanceTitleValue = screen.getByText(defaultProps.title);

      expect(instanceTitleValue).toBeInTheDocument();
    });

    it('should render contributor label', () => {
      const contributorLabel = screen.getByText(labelIds.contributor);

      expect(contributorLabel).toBeInTheDocument();
    });

    it('should render contributor value', () => {
      const contributorValue = screen.getByText(defaultProps.contributors[0].name);

      expect(contributorValue).toBeInTheDocument();
    });

    it('should render publication date label', () => {
      const publicationsDateLabel = screen.getByText(labelIds.publicationsDate);

      expect(publicationsDateLabel).toBeInTheDocument();
    });

    it('should render publications date value', () => {
      const publicationsDateValue = screen.getByText(defaultProps.publications[0].dateOfPublication);

      expect(publicationsDateValue).toBeInTheDocument();
    });

    it('should render edition label', () => {
      const editionLabel = screen.getByText(labelIds.edition);

      expect(editionLabel).toBeInTheDocument();
    });

    it('should render edition value', () => {
      const editionValue = screen.getByText(defaultProps.editions[0].name);

      expect(editionValue).toBeInTheDocument();
    });

    it('should render identifiers label', () => {
      const identifiersLabel = screen.getByText(labelIds.identifiers);

      expect(identifiersLabel).toBeInTheDocument();
    });

    it('should render identifiers value', () => {
      const identifiersValue = screen.getByText(defaultProps.identifiers[0].value);

      expect(identifiersValue).toBeInTheDocument();
    });
  });

  describe('When tlr amount is not a link', () => {
    const props = {
      ...defaultProps,
      titleLevelRequestsLink: false,
    };

    beforeEach(() => {
      render(
        <TitleInformation
          {...props}
        />
      );
    });

    it('should not trigger Link with inventory url', () => {
      const expectedProps = {
        to: `/mediated-requests-activities?filters=${OPEN_REQUEST_STATUS_FILTERS},requestLevels.${REQUEST_LEVEL_TYPES.TITLE}&query=${defaultProps.instanceId}&sort=${REQUEST_DATE}`,
      };

      expect(Link).not.toHaveBeenCalledWith(expect.objectContaining(expectedProps) ,{});
    });
  });
});
