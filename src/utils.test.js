import {
  transformRequestFilterOptions,
  handleKeyCommand,
  isFormEditing,
  memoizeValidation,
  isValidRequest,
  getTlrSettings,
  getPatronGroup,
  isSubmittingButtonDisabled,
  getFormattedYears,
  getStatusQuery,
  getInstanceQueryString,
  getFullName,
} from './utils';
import { INVALID_REQUEST_HARDCODED_ID } from './constants';

describe('utils', () => {
  describe('transformRequestFilterOptions', () => {
    const formatMessage = jest.fn(({ id }) => id);
    const option = {
      label: 'label',
      value: 'value',
    };

    it('should return data options', () => {
      expect(transformRequestFilterOptions(formatMessage, [option])).toEqual([option]);
    });

    it('should not return data options', () => {
      expect(transformRequestFilterOptions(formatMessage)).toEqual([]);
    });
  });

  describe('handlekeycommand', () => {
    const event = {
      preventDefault: jest.fn(),
    };
    const handler = jest.fn();

    afterEach(() => {
      event.preventDefault.mockClear();
      handler.mockClear();
    });

    describe('When disabled is true and event was passed', () => {
      it('should not call handler function', () => {
        handleKeyCommand(handler, { disabled: true })(event);

        expect(handler).not.toHaveBeenCalled();
      });
    });

    describe('When disabled is false and event was passed', () => {
      it('should call handler function', () => {
        handleKeyCommand(handler)(event);

        expect(handler).toHaveBeenCalled();
      });

      it('should call preventDefault', () => {
        handleKeyCommand(handler)(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('When event is not passed', () => {
      it('should not call preventDefault when event is not passed', () => {
        handleKeyCommand(handler)();

        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('isFormEditing', () => {
    describe('When id is presented', () => {
      it('should return true', () => {
        expect(isFormEditing({ id: 'id' })).toBe(true);
      });
    });

    describe('when id is not presented', () => {
      it('should return false', () => {
        expect(isFormEditing({})).toBe(false);
      });
    });
  });

  describe('memoizeValidation', () => {
    const functionResult = 'result';
    const fn = jest.fn(() => functionResult);
    const fieldName = 'item.barcode';
    const key1 = 0;
    const key2 = 1;
    const arg = '123';

    beforeEach(() => {
      fn.mockClear();
    });

    describe('Memoized function', () => {
      describe('When `arg !== lastArg`', () => {
        it('should be invoked with correct argument', () => {
          memoizeValidation(fn)(fieldName, key1)(arg);

          expect(fn).toBeCalledWith(arg);
        });
      });

      describe('When `key !== lastKey && arg === lastArg`', () => {
        it('should be invoked with correct argument', () => {
          memoizeValidation(fn)(fieldName, key2)(arg);

          expect(fn).toBeCalledWith(arg);
        });
      });

      describe('When `key === lastKey && arg === lastArg`', () => {
        let result;

        beforeEach(() => {
          const returnedFunc = memoizeValidation(fn);

          returnedFunc(fieldName, key1)(arg);
          result = returnedFunc(fieldName, key1)(arg);
        });

        it('should be invoked one time only', () => {
          expect(fn).toBeCalledTimes(1);
        });

        it('should return cashed result', () => {
          expect(result).toBe(functionResult);
        });
      });
    });
  });

  describe('isValidRequest', () => {
    describe('When request is valid', () => {
      it('should return true', () => {
        const request = {
          instanceId: 'instanceId',
          holdingsRecordId: 'holdingRecordId',
        };

        expect(isValidRequest(request)).toBe(true);
      });
    });

    describe('When request is not valid', () => {
      it('should return false', () => {
        const request = {
          instanceId: INVALID_REQUEST_HARDCODED_ID,
          holdingsRecordId: INVALID_REQUEST_HARDCODED_ID,
        };

        expect(isValidRequest(request)).toBe(false);
      });
    });
  });

  describe('getInstanceQueryString', () => {
    const hrid = 'hrid';
    const id = 'instanceId';

    describe('When both values are passed', () => {
      it('should return correct query string', () => {
        const expectedResult = `("hrid"=="${hrid}" or "id"=="${id}")`;

        expect(getInstanceQueryString(hrid, id)).toBe(expectedResult);
      });
    });

    describe('When only `hrid` value is passed', () => {
      it('should return correct query string', () => {
        const expectedResult = `("hrid"=="${hrid}" or "id"=="${hrid}")`;

        expect(getInstanceQueryString(hrid)).toBe(expectedResult);
      });
    });

    describe('When only `id` value is passed', () => {
      it('should return correct query string', () => {
        const expectedResult = `("hrid"=="${id}" or "id"=="${id}")`;

        expect(getInstanceQueryString(id)).toBe(expectedResult);
      });
    });
  });

  describe('getStatusQuery', () => {
    it('should return query string', () => {
      const statusesList = ['test', 'test_2'];
      const expectedResult = 'status=="test" or status=="test_2"';

      expect(getStatusQuery(statusesList)).toBe(expectedResult);
    });

    it('should return empty string', () => {
      expect(getStatusQuery()).toBe('');
    });
  });

  describe('getTlrSettings', () => {
    const defaultSettings = {
      titleLevelRequestsFeatureEnabled: true,
      createTitleLevelRequestsByDefault: false,
    };

    it('should return passed settings', () => {
      expect(getTlrSettings(defaultSettings)).toEqual(defaultSettings);
    });

    it('should return empty object', () => {
      expect(getTlrSettings()).toEqual({});
    });
  });

  describe('getPatronGroup', () => {
    describe('When patron has a patron group', () => {
      const patron = {
        patronGroup: 'patronGroupId',
      };
      const patronGroups = [
        {
          id: patron.patronGroup,
        }
      ];

      it('should return correct patron group', () => {
        expect(getPatronGroup(patron, patronGroups)).toEqual(patronGroups[0]);
      });
    });

    describe('When patron does not have a patron group', () => {
      const patron = {};
      const patronGroups = [
        {
          id: 'id',
        }
      ];

      it('should return undefined', () => {
        expect(getPatronGroup(patron, patronGroups)).toBeUndefined();
      });
    });
  });

  describe('isSubmittingButtonDisabled', () => {
    describe('when pristine is true and submitting is false', () => {
      it('should return true', () => {
        expect(isSubmittingButtonDisabled(true, false)).toBe(true);
      });
    });

    describe('when pristine is false and submitting is true', () => {
      it('should return true', () => {
        expect(isSubmittingButtonDisabled(false, true)).toBe(true);
      });
    });

    describe('when pristine is true and submitting is true', () => {
      it('should return true', () => {
        expect(isSubmittingButtonDisabled(true, true)).toBe(true);
      });
    });

    describe('when pristine is false and submitting is false', () => {
      it('should return true', () => {
        expect(isSubmittingButtonDisabled(false, false)).toBe(false);
      });
    });
  });

  describe('getFormattedYears', () => {
    describe('When publications are not passed', () => {
      it('should return empty string', () => {
        expect(getFormattedYears()).toBe('');
      });
    });

    describe('When there are no publications', () => {
      it('should return empty string', () => {
        expect(getFormattedYears([])).toBe('');
      });
    });

    describe('When publications are presented', () => {
      it('should format correctly when limit is passed', () => {
        const publications = [
          { dateOfPublication: '1991' },
          { dateOfPublication: 'incorrect_year_2000' },
          { dateOfPublication: '1992' },
          { dateOfPublication: '1990' },
          { dateOfPublication: '2020' }
        ];
        const limit = 3;

        expect(getFormattedYears(publications, limit)).toBe('2020, 1992, 1991');
      });
    });
  });

  describe('getFullName', () => {
    describe('When user has preferredFirstName', () => {
      const user = {
        lastName: 'lastName',
        preferredFirstName: 'preferredFirstName',
        middleName: 'middleName',
      };

      it('should return correct name', () => {
        const expectedResult = `${user.lastName}, ${user.preferredFirstName} ${user.middleName}`;

        expect(getFullName(user)).toBe(expectedResult);
      });
    });

    describe('When user does not have preferredFirstName', () => {
      const user = {
        lastName: 'lastName',
        middleName: 'middleName',
      };

      it('should return correct name', () => {
        const expectedResult = `${user.lastName} ${user.middleName}`;

        expect(getFullName(user)).toBe(expectedResult);
      });
    });
  });
});
