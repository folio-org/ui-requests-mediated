jest.mock('@folio/stripes/core', () => ({
  AppIcon: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  useOkapiKy: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) }),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    extend: jest.fn().mockReturnValue(this),
  }),
  useNamespace: () => ['@folio/requests-mediated'],
  stripesConnect: Component => props => <Component {...props} />,
  IfInterface: jest.fn(({ name, children }) => {
    return name === 'interface' ? children : null;
  }),
  IfPermission: jest.fn(({ perm, children }) => {
    return perm === 'permission' ? children : null;
  }),
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
}));
