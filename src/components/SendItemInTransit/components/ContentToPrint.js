import PropTypes from 'prop-types';
import {
  useIntl,
} from 'react-intl';
import HtmlToReact, {
  Parser,
} from 'html-to-react';
import DOMPurify from 'dompurify';

import {
  useStripes,
} from '@folio/stripes/core';
import {
  convertToSlipData,
} from '@folio/stripes/util';

import {
  buildTemplate,
  shouldProcessNode,
  processNode,
} from '../../../utils';

import {
  SLIP_DATA_PROP_TYPES,
  STAFF_SLIPS_TYPE,
} from '../../../constants';

const ContentToPrint = ({
  contentToPrintId,
  template,
  dataSource,
}) => {
  const intl = useIntl();
  const {
    timezone,
    locale,
  } = useStripes();

  if (!dataSource) {
    return null;
  }

  const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions();
  const rules = [
    {
      replaceChildren: true,
      shouldProcessNode,
      processNode,
    },
    {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ];
  const parser = new Parser();
  const cathedralTemplate = buildTemplate(template);
  const staffSlipContext = {
    requester: dataSource?.requester,
    currentDateTime: dataSource?.inTransitDate,
    ...dataSource?.staffSlipContext,
  };
  const componentStr = DOMPurify.sanitize(cathedralTemplate(convertToSlipData([staffSlipContext], intl, timezone, locale, {
    slipName: STAFF_SLIPS_TYPE.TRANSIT_MEDIATED_REQUESTS,
  })[0]), { ADD_TAGS: ['Barcode'] });
  const Component = parser.parseWithInstructions(componentStr, () => true, rules) || null;

  return (
    <div id={contentToPrintId}>
      {Component}
    </div>
  );
};

ContentToPrint.propTypes = {
  contentToPrintId: PropTypes.string.isRequired,
  template: PropTypes.string.isRequired,
  dataSource: PropTypes.shape({
    requester: PropTypes.shape({
      id: PropTypes.string,
      barcode: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      middleName: PropTypes.string,
      preferredFirstName: PropTypes.string,
    }).isRequired,
    inTransitDate: PropTypes.string.isRequired,
    staffSlipContext: SLIP_DATA_PROP_TYPES,
  }),
};

export default ContentToPrint;
