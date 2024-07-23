import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import PickupServicePoint from './PickupServicePoint';
import { MEDIATED_REQUEST_TYPES } from '../../../../constants';

const basicProps = {
  isEditForm: false,
  shouldValidate: false,
  request: {},
  values: {
    requestType: MEDIATED_REQUEST_TYPES.HOLD,
  },
  requestTypes: {
    [MEDIATED_REQUEST_TYPES.HOLD]: [
      {
        id: 'id',
        name: 'name',
      }
    ],
  },
};
const labelIds = {
  pickupServicePoint: 'ui-requests-mediated.form.request.pickupServicePoint',
};

describe('PickupServicePoint', () => {
  beforeEach(() => {
    render(
      <PickupServicePoint
        {...basicProps}
      />
    );
  });

  it('should render dropdown label', () => {
    const pickupServicePointLabel = screen.getByText(labelIds.pickupServicePoint);

    expect(pickupServicePointLabel).toBeInTheDocument();
  });
});
