import { Redirect } from 'react-router';

import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import NoteViewer from './NoteViewer';
import { getMediatedRequestsActivitiesUrl } from '../../constants';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Redirect: jest.fn(),
}));

const testIds = {
  noteViewPage: 'noteViewPage',
};
const basicProps = {
  location: {
    state: {
      referredRecordData: {},
    },
  },
  history: {
    goBack: jest.fn(),
    replace: jest.fn(),
  },
  match: {
    params: {
      noteId: 'noteId',
    },
  },
};

describe('NoteViewer', () => {
  describe('When location state is not empty', () => {
    beforeEach(() => {
      render(
        <NoteViewer
          {...basicProps}
        />
      );
    });

    it('should render NoteViewPage', () => {
      const noteViewPage = screen.getByTestId(testIds.noteViewPage);

      expect(noteViewPage).toBeInTheDocument();
    });

    it('should handle edit action', () => {
      const editButton = screen.getByRole('button');

      fireEvent.click(editButton);

      expect(basicProps.history.replace).toHaveBeenCalledWith({
        pathname: `${getMediatedRequestsActivitiesUrl()}/notes/${basicProps.match.params.noteId}/edit`,
        state: basicProps.location.state,
      });
    });
  });

  describe('When location state is empty', () => {
    const props = {
      ...basicProps,
      location: {},
    };

    beforeEach(() => {
      render(
        <NoteViewer
          {...props}
        />
      );
    });

    it('should trigger Redirect', () => {
      expect(Redirect).toHaveBeenCalled();
    });
  });
});
