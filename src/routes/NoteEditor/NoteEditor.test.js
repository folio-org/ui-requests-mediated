import { Redirect } from 'react-router';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import NoteEditor from './NoteEditor';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Redirect: jest.fn(),
}));

const testIds = {
  noteEditPage: 'noteEditPage',
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
  match: {
    params: {
      noteId: 'noteId',
    },
  },
};

describe('NoteEditor', () => {
  describe('When location state is not empty', () => {
    beforeEach(() => {
      render(
        <NoteEditor
          {...basicProps}
        />
      );
    });

    it('should render NoteEditPage', () => {
      const noteEditPage = screen.getByTestId(testIds.noteEditPage);

      expect(noteEditPage).toBeInTheDocument();
    });
  });

  describe('When location state is empty', () => {
    const props = {
      ...basicProps,
      location: {},
    };

    beforeEach(() => {
      render(
        <NoteEditor
          {...props}
        />
      );
    });

    it('should trigger Redirect', () => {
      expect(Redirect).toHaveBeenCalled();
    });
  });
});
