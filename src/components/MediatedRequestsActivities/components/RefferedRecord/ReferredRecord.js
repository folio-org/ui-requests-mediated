import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  FormattedDate,
  KeyValue,
} from '@folio/stripes/components';

import { getUserHighlightBoxLink } from '../../../../utils';

import css from './ReferredRecord.css';

const ReferredRecord = ({ values }) => {
  const {
    instanceId,
    instanceTitle,
    itemBarcode,
    itemId,
    holdingsRecordId,
    requestCreateDate,
    requesterId,
    requesterName,
  } = values;

  const instanceLink = <Link to={`/inventory/view/${instanceId}`}>{instanceTitle}</Link>;
  const itemLink = <Link to={`/inventory/view/${instanceId}/${holdingsRecordId}/${itemId}`}>{itemBarcode}</Link>;
  const label = (
    <span className={css.referredRecord}>
      <FormattedMessage id="ui-requests-mediated.notes.entityType.request" />
    </span>
  );

  return (
    <KeyValue label={label}>
      <div>
        <FormattedMessage
          id="ui-requests-mediated.notes.assigned.for"
          values={{
            instanceLink,
            itemLink,
          }}
        />
      </div>
      <div>
        <FormattedMessage
          id="ui-requests-mediated.notes.assigned.requester"
          values={{ requesterName: getUserHighlightBoxLink(requesterName, requesterId) }}
        />
      </div>
      <div>
        <FormattedMessage
          id="ui-requests-mediated.notes.assigned.requestDate"
          values={{ requestCreateDate: <FormattedDate value={requestCreateDate} /> }}
        />
      </div>
    </KeyValue>
  );
};

ReferredRecord.propTypes = {
  values: PropTypes.shape({
    instanceId: PropTypes.string.isRequired,
    instanceTitle: PropTypes.string.isRequired,
    itemBarcode: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    holdingsRecordId: PropTypes.string.isRequired,
    requestCreateDate: PropTypes.string.isRequired,
    requesterId: PropTypes.string.isRequired,
    requesterName: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReferredRecord;
