import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Pane,
  Paneset,
  Button,
  TextField,
  Row,
  Col,
} from '@folio/stripes/components';

import NavigationMenu from '../NavigationMenu';
import {
  ConfirmItemList
} from './components';

import {
  CONFIRM_ITEM_TYPES,
  FILTER_PANE_WIDTH,
} from '../../constants';

const ConfirmItem = ({
  pristine,
  paneTitle,
  navigationMenuFunction,
  confirmItemType,
  contentData,
  handleSubmit,
}) => {
  const intl = useIntl();
  const itemBarcodeInputPlaceholder = intl.formatMessage({ id: 'ui-requests-mediated.confirmItem.mainSection.itemBarcodeInput.placeholder' });

  return (
    <Paneset data-testid="confirmItemPaneSet">
      <Pane
        data-testid="navigationMenuPane"
        defaultWidth={FILTER_PANE_WIDTH}
        paneTitle={paneTitle}
      >
        <NavigationMenu value={navigationMenuFunction} />
      </Pane>
      <Pane
        data-testid="confirmItemPane"
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-requests-mediated.confirmItem.mainSection.paneTitle" />}
      >
        <form onSubmit={handleSubmit}>
          <Row>
            <Col xs={9} sm={4}>
              <Field
                id="itemBarcodeInput"
                name="itemBarcode"
                data-testid="itemBarcodeInput"
                autoFocus
                fullWidth
                validationEnabled={false}
                placeholder={itemBarcodeInputPlaceholder}
                component={TextField}
              />
            </Col>
            <Col xs={3} sm={1}>
              <Button
                id="itemBarcodeEnter"
                fullWidth
                type="submit"
                disabled={pristine}
              >
                <FormattedMessage id="ui-requests-mediated.confirmItem.mainSection.enter" />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ConfirmItemList
                confirmItemType={confirmItemType}
                contentData={contentData}
              />
            </Col>
          </Row>
        </form>
      </Pane>
    </Paneset>
  );
};

ConfirmItem.propTypes = {
  pristine: PropTypes.bool,
  paneTitle: PropTypes.node.isRequired,
  navigationMenuFunction: PropTypes.func.isRequired,
  confirmItemType: PropTypes.oneOf([CONFIRM_ITEM_TYPES.CONFIRM_ITEM_ARRIVAL, CONFIRM_ITEM_TYPES.SEND_ITEM_IN_TRANSIT]).isRequired,
  contentData: PropTypes.arrayOf(PropTypes.object),
  handleSubmit: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
})(ConfirmItem);
