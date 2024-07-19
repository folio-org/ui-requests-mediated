import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import PickupServicePoint from './PickupServicePoint';
import { REQUEST_TYPES } from '../../../../constants';

const basicProps = {
  isEditForm: false,
  shouldValidate: false,
  request: {},
  values: {
    requestType: REQUEST_TYPES.HOLD,
  },
  requestTypes: {
    [REQUEST_TYPES.HOLD]: [
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
