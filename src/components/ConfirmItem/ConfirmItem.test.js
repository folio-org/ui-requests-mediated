import { Field } from 'react-final-form';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  Button,
  TextField,
} from '@folio/stripes/components';

import ConfirmItem from './ConfirmItem';
import NavigationMenu from '../NavigationMenu';
import {
  ConfirmItemList
} from './components';

import {
  CONFIRM_ITEM_TYPES,
} from '../../constants';

jest.mock('@folio/stripes/final-form', () => () => jest.fn((component) => component));
jest.mock('../NavigationMenu', () => jest.fn((props) => (<div {...props} />)));
jest.mock('./components/ConfirmItemList', () => jest.fn((props) => (<div {...props} />)));

const testIds = {
  confirmItemPaneSet: 'confirmItemPaneSet',
  navigationMenuPane: 'navigationMenuPane',
  confirmItemPane: 'confirmItemPane',
};
const labelIds = {
  paneTitle: 'ui-requests-mediated.confirmItem.mainSection.paneTitle',
  placeholder: 'ui-requests-mediated.confirmItem.mainSection.itemBarcodeInput.placeholder',
};
const basicProps = {
  pristine: false,
  paneTitle: 'paneTitle',
  navigationMenuUrl: 'confirmItem',
  confirmItemType: CONFIRM_ITEM_TYPES.CONFIRM_ITEM_ARRIVAL,
  contentData: [],
  handleSubmit: jest.fn(),
};

describe('ConfirmItem', () => {
  beforeEach(() => {
    render(<ConfirmItem {...basicProps} />);
  });

  it('should render pane set', () => {
    expect(screen.getByTestId(testIds.confirmItemPaneSet)).toBeInTheDocument();
  });

  describe('navigation menu pane', () => {
    it('should render pane', () => {
      expect(screen.getByTestId(testIds.navigationMenuPane)).toBeInTheDocument();
    });

    it('should render pane title', () => {
      expect(screen.getByText(basicProps.paneTitle)).toBeVisible();
    });
  });

  describe('confirm item pane', () => {
    it('should render pane', () => {
      expect(screen.getByTestId(testIds.confirmItemPane)).toBeInTheDocument();
    });

    it('should render pane title', () => {
      expect(screen.getByText(labelIds.paneTitle)).toBeVisible();
    });
  });

  it('should render navigation menu with correct props', () => {
    expect(NavigationMenu).toHaveBeenCalledWith(expect.objectContaining({
      value: basicProps.navigationMenuUrl,
    }), {});
  });

  it('should render Field with correct props', () => {
    expect(Field).toHaveBeenCalledWith(expect.objectContaining({
      id: 'itemBarcodeInput',
      name: 'itemBarcode',
      'data-testid': 'itemBarcodeInput',
      autoFocus: true,
      fullWidth: true,
      validationEnabled: false,
      placeholder: labelIds.placeholder,
      component: TextField,
    }), {});
  });

  it('should render Button with correct props', () => {
    expect(Button).toHaveBeenCalledWith(expect.objectContaining({
      id: 'itemBarcodeEnter',
      fullWidth: true,
      type: 'submit',
      disabled: basicProps.pristine,
    }), {});
  });

  it('should render ConfirmItemList with correct props', () => {
    expect(ConfirmItemList).toHaveBeenCalledWith(expect.objectContaining({
      confirmItemType: basicProps.confirmItemType,
      contentData: basicProps.contentData,
    }), {});
  });
});
