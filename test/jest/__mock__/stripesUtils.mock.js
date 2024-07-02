jest.mock('@folio/stripes/util', () => ({
  effectiveCallNumber: jest.fn().mockReturnValue('effectiveCallNumber'),
}));
