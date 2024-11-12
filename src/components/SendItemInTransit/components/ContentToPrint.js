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
  buildTemplate,
  shouldProcessNode,
  processNode,
  convertToSlipData,
} from '../../../utils';

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
  const componentStr = DOMPurify.sanitize(cathedralTemplate(convertToSlipData(staffSlipContext, intl, timezone, locale)), { ADD_TAGS: ['Barcode'] });
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
    requester: PropTypes.object.isRequired,
    inTransitDate: PropTypes.string.isRequired,
    staffSlipContext: PropTypes.object.isRequired,
  }),
};

export default ContentToPrint;
