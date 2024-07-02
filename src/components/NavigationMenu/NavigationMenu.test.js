import { useIntl } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { Select } from '@folio/stripes/components';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import {
  getConfirmItemArrivalUrl,
  getMediatedRequestsActivitiesUrl,
  getSendItemInTransitUrl,
} from '../../constants';

import NavigationMenu, {
  getDataOptions,
  handleChangeMenu,
} from './NavigationMenu';

const testIds = {
  navigationMenu: 'navigationMenu',
};

describe('NavigationMenu', () => {
  const dataOptions = [
    {
      label: 'ui-requests-mediated.app.mediatedRequestsActivities.navigation',
      value: getMediatedRequestsActivitiesUrl(),
    },
    {
      label: 'ui-requests-mediated.app.confirmItemArrival.navigation',
      value: getConfirmItemArrivalUrl(),
    },
    {
      label: 'ui-requests-mediated.app.sendItemInTransit.navigation',
      value: getSendItemInTransitUrl(),
    },
  ];

  describe('NavigationMenu', () => {
    const location = {
      pathname: getMediatedRequestsActivitiesUrl(),
      search: '',
    };
    const route = getMediatedRequestsActivitiesUrl();

    beforeEach(() => {
      render(
        <MemoryRouter initialEntries={[route]}>
          <NavigationMenu
            history={{
              location,
            }}
            location={location}
            value={getMediatedRequestsActivitiesUrl()}
          />
        </MemoryRouter>
      );
    });

    it('should render select with correct props', () => {
      expect(Select).toHaveBeenCalledWith(expect.objectContaining({
        value: getMediatedRequestsActivitiesUrl(),
        dataOptions,
        onChange: expect.any(Function),
      }), {});
    });

    it('should be selected default value', () => {
      const options = screen.getAllByTestId(`${testIds.navigationMenu}selectOption`);

      expect(options[0].selected).toBeTruthy();
      expect(options[1].selected).toBeFalsy();
      expect(options[2].selected).toBeFalsy();
    });

    it('should be selected value that was selected', async () => {
      await userEvent.selectOptions(screen.getByTestId(testIds.navigationMenu), dataOptions[1].value);

      const options = screen.getAllByTestId(`${testIds.navigationMenu}selectOption`);

      expect(options[0].selected).toBeFalsy();
      expect(options[1].selected).toBeTruthy();
      expect(options[2].selected).toBeFalsy();
    });
  });

  describe('getDataOptions', () => {
    const intl = useIntl();

    it('should return data options', () => {
      expect(getDataOptions(intl)).toEqual(dataOptions);
    });
  });

  describe('handleChangeMenu', () => {
    const push = jest.fn();

    it('should handel correct when pathname equal mediated requests activities', () => {
      const event = {
        target: {
          value: getMediatedRequestsActivitiesUrl(),
        },
      };
      const location = {
        pathname: getConfirmItemArrivalUrl(),
        state: '',
        search: '',
      };
      const history = {
        location,
        push,
      };

      handleChangeMenu(event, location, history);

      expect(push).toHaveBeenCalledWith(expect.objectContaining({
        pathname: getMediatedRequestsActivitiesUrl(),
      }));
    });

    it('should handel correct when pathname not equal mediated requests activities', () => {
      const event = {
        target: {
          value: getConfirmItemArrivalUrl(),
        },
      };
      const location = {
        pathname: getMediatedRequestsActivitiesUrl(),
        state: '',
        search: '',
      };
      const history = {
        location,
        push,
      };

      handleChangeMenu(event, location, history);

      expect(push).toHaveBeenCalledWith(expect.objectContaining({
        pathname: getConfirmItemArrivalUrl(),
      }));
    });
  });
});
