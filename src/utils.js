export const transformRequestFilterOptions = (formatMessage, source = []) => (
  source.map(({ label, value }) => ({
    label: formatMessage({ id: label }),
    value,
  }))
);

export const getIsTitleLevelRequestsFeatureEnabled = (data) => (
  data?.configs.records[0]?.value?.titleLevelRequestsFeatureEnabled || false
);
