import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';

import {
  Pane,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';
import {
  SearchAndSortQuery,
  ExpandFilterPaneButton,
  CollapseFilterPaneButton,
} from '@folio/stripes/smart-components';

import NavigationMenu from '../NavigationMenu';
import MediatedRequestsFilters from './components/MediatedRequestsFilters';

import {
  APP_ICON_NAME,
  FILTER_PANE_WIDTH,
  getMediatedRequestsActivitiesUrl,
} from '../../constants';

const MediatedRequestsActivities = ({ settings }) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(!filterPaneIsVisible);
  };

  const renderResultsFirstMenu = () => {
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  return (
    <SearchAndSortQuery data-testid="mediatedRequestsActivitiesSearchAndSortQuery">
      {() => (
        <Paneset data-testid="mediatedRequestsActivitiesPaneSet">
          {filterPaneIsVisible &&
            <Pane
              data-testid="mediatedRequestsActivitiesPane"
              defaultWidth={FILTER_PANE_WIDTH}
              paneTitle={<FormattedMessage id="ui-requests-mediated.app.filterPane.selectActivity" />}
              lastMenu={
                <PaneMenu>
                  <CollapseFilterPaneButton
                    data-testid="mediatedRequestsActivitiesCollapseFilterPaneButton"
                    onClick={toggleFilterPane}
                  />
                </PaneMenu>
              }
            >
              <NavigationMenu
                value={getMediatedRequestsActivitiesUrl()}
                separator
              />
              <MediatedRequestsFilters settings={settings} />
            </Pane>
          }
          <Pane
            defaultWidth="fill"
            appIcon={<AppIcon app={APP_ICON_NAME} />}
            paneTitle={<FormattedMessage id="ui-requests-mediated.app.mediatedRequestsActivities.paneTitle" />}
            firstMenu={renderResultsFirstMenu()}
          />
        </Paneset>
      )}
    </SearchAndSortQuery>
  );
};

MediatedRequestsActivities.propTypes = {
  settings: PropTypes.object.isRequired,
};

export default MediatedRequestsActivities;
