jest.mock('@folio/stripes/core', () => ({
  AppIcon: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  useOkapiKy: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) }),
    post: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) }),
    put: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) }),
    delete: jest.fn(),
    extend: jest.fn().mockReturnValue(this),
  }),
  useNamespace: () => ['@folio/requests-mediated'],
  useCallout: jest.fn().mockReturnValue({
    sendCallout: jest.fn(),
  }),
  stripesConnect: Component => props => <Component {...props} />,
  IfInterface: jest.fn(({ name, children }) => {
    return name === 'interface' ? children : null;
  }),
  IfPermission: jest.fn(({ children }) => (children)),
  Pluggable: jest.fn(({
    searchLabel,
    selectInstance = () => {},
    selectUser = () => {},
  }) => {
    const handleClick = () => {
      selectInstance({ hrid: 'hrid' });
      selectUser();
    };

    return (
      <>
        <div>{searchLabel}</div>
        <button
          type="button"
          onClick={handleClick}
        >
          Search
        </button>
      </>
    );
  }),
  Redirect: jest.fn(() => <div />),
  Route: jest.fn(({ children }) => children),
  Switch: jest.fn(({ children }) => children),
  TitleManager: jest.fn(() => <div />),
  useStripes: jest.fn(() => ({
    connect: Component => Component,
    timezone: 'UTC',
    locale: 'en-US',
    hasInterface: jest.fn().mockReturnValue(true),
    hasPerm: jest.fn().mockReturnValue(true),
  })),
}));
