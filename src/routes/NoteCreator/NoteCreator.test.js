import { Redirect } from 'react-router';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import NoteCreator from './NoteCreator';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Redirect: jest.fn(),
}));

const testIds = {
  noteCreatePage: 'noteCreatePage',
};
const basicProps = {
  location: {
    state: {
      referredRecordData: {},
    },
  },
  history: {
    goBack: jest.fn(),
  },
};

describe('NoteCreator', () => {
  describe('When location state is not empty', () => {
    beforeEach(() => {
      render(
        <NoteCreator
          {...basicProps}
        />
      );
    });

    it('should render NoteCreatePage', () => {
      const noteCreatePage = screen.getByTestId(testIds.noteCreatePage);

      expect(noteCreatePage).toBeInTheDocument();
    });
  });

  describe('When location state is empty', () => {
    const props = {
      ...basicProps,
      location: {},
    };

    beforeEach(() => {
      render(
        <NoteCreator
          {...props}
        />
      );
    });

    it('should trigger Redirect', () => {
      expect(Redirect).toHaveBeenCalled();
    });
  });
});
