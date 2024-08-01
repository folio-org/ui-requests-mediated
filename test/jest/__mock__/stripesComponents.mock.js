jest.mock('@folio/stripes/components', () => ({
  Accordion: jest.fn(({
    children,
    label,
    onClearFilter,
    'data-testid': testId,
  }) => (
    <div data-testid={testId}>
      <span>{label}</span>
      <span>{children}</span>
      <div>
        <button
          type="button"
          onClick={onClearFilter}
          data-testid={`${testId}Button`}
        >Clear
        </button>
      </div>
    </div>
  )),
  AccordionSet: jest.fn(({
    children,
    onToggle,
    'data-testid': testId,
  }) => (
    <div data-testid={testId}>
      <button type="button" onClick={onToggle}>
        Toggle
      </button>
      {children}
    </div>
  )),
  AccordionStatus: jest.fn(({ children }) => <div>{children}</div>),
  Badge: jest.fn((props) => (
    <span>
      <span>{props.children}</span>
    </span>
  )),
  Button: jest.fn(({
    children,
    ...rest
  }) => (
    <button
      type="button"
      {...rest}
    >
      <span>
        {children}
      </span>
    </button>
  )),
  Checkbox: jest.fn((props) => (
    <input
      type="checkbox"
      {...props}
    />
  )),
  checkScope: jest.fn(),
  Col: jest.fn(({ children }) => <div className="col">{ children }</div>),
  MultiColumnList: jest.fn((props) => (
    <div {...props} />
  )),
  FormattedTime: jest.fn(({ value }) => <div>{value}</div>),
  collapseAllSections: jest.fn(),
  Datepicker: jest.fn(({ ref, children, ...rest }) => (
    <div ref={ref} {...rest}>
      {children}
      <input type="text" />
    </div>
  )),
  expandAllSections: jest.fn(),
  FormattedDate: jest.fn(({ value }) => <div>{value}</div>),
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  Headline: jest.fn(({ children }) => <div>{ children }</div>),
  Icon: jest.fn((props) => (props && props.children ? props.children : <span />)),
  IconButton: jest.fn(({
    buttonProps,
    // eslint-disable-next-line no-unused-vars
    iconClassName,
    ...rest
  }) => (
    <button type="button" {...buttonProps}>
      <span {...rest} />
    </button>
  )),
  KeyValue: jest.fn(({
    label,
    children,
    value,
    'data-testid': testId,
  }) => (
    <div data-testid={testId}>
      <div>
        {label}
      </div>
      <div>
        {children || value}
      </div>
    </div>
  )),
  Label: jest.fn(({ children, ...rest }) => (
    <span {...rest}>{children}</span>
  )),
  Layout: jest.fn(({
    children,
    ...rest
  }) => <div {...rest}>{children}</div>),
  Loading: jest.fn(() => <div />),
  // oy, dismissible. we need to pull it out of props so it doesn't
  // get applied to the div as an attribute, which must have a string-value,
  // which will shame you in the console:
  //
  //     Warning: Received `true` for a non-boolean attribute `dismissible`.
  //     If you want to write it to the DOM, pass a string instead: dismissible="true" or dismissible={value.toString()}.
  //         in div (created by mockConstructor)
  //
  // is there a better way to throw it away? If we don't destructure and
  // instead access props.label and props.children, then we get a test
  // failure that the modal isn't visible. oy, dismissible.
  Modal: jest.fn(({ children, label, dismissible, footer, ...rest }) => {
    return (
      <div
        data-test={dismissible ? '' : ''}
        {...rest}
      >
        <h1>{label}</h1>
        {children}
        {footer}
      </div>
    );
  }),
  ModalFooter: jest.fn((props) => (
    <div>{props.children}</div>
  )),
  MultiSelection: jest.fn(({ children, dataOptions }) => (
    <div>
      <select multiple>
        {dataOptions.forEach((option, i) => (
          <option
            value={option.value}
            key={option.id || `option-${i}`}
          >
            {option.label}
          </option>
        ))}
      </select>
      {children}
    </div>
  )),
  NavList: jest.fn(({ children, className, ...rest }) => (
    <div className={className} {...rest}>{children}</div>
  )),
  NavListItem: jest.fn(({ children, className, ...rest }) => (
    <div className={className} {...rest}>{children}</div>
  )),
  NavListSection: jest.fn(({ children, className, ...rest }) => (
    <div className={className} {...rest}>{children}</div>
  )),
  NoValue: jest.fn(() => <div />),
  Pane: jest.fn(({
    children,
    className,
    defaultWidth,
    paneTitle,
    paneSub,
    firstMenu,
    lastMenu,
    fluidContentWidth,
    ...rest
  }) => {
    return (
      <div className={className} {...rest} style={!fluidContentWidth ? { width: '960px' } : { width: defaultWidth }}>
        <div>
          {firstMenu ?? null}
          <span>{paneTitle}</span>
          <span>{paneSub}</span>
          {lastMenu ?? null}
        </div>
        {children}
      </div>
    );
  }),
  Paneset: jest.fn(({ children, defaultWidth, ...rest }) => {
    return (
      <div {...rest} style={{ width: defaultWidth }}>
        {children}
      </div>
    );
  }),
  PaneFooter: jest.fn(({ ref, children, ...rest }) => (
    <div ref={ref} {...rest}>{children}</div>
  )),
  PaneHeader: jest.fn(({ paneTitle, firstMenu, lastMenu }) => (
    <div>
      {firstMenu ?? null}
      {paneTitle}
      {lastMenu ?? null}
    </div>
  )),
  PaneBackLink: jest.fn(() => <span />),
  PaneMenu: jest.fn((props) => <div>{props.children}</div>),
  PaneHeaderIconButton: jest.fn(() => <div />),
  RadioButton: jest.fn(({ label, name, ...rest }) => (
    <div>
      <label htmlFor="male">{label}</label>
      <input
        type="radio"
        name={name}
        {...rest}
      />
    </div>
  )),
  RadioButtonGroup: jest.fn(({ label, children, ...rest }) => (
    <fieldset {...rest}>
      <legend>{label}</legend>
      {children}
    </fieldset>
  )),
  Row: jest.fn(({ children }) => <div className="row">{ children }</div>),
  SearchField: jest.fn((props) => (
    <input
      {...props}
    />
  )),
  Select: jest.fn(({
    children,
    'data-testid': testId,
    dataOptions = [],
    label,
    onChange,
  }) => {
    const selectTestId = testId || 'selectTestId';
    const selectOptionTestId = `${selectTestId}selectOption`;

    return (
      <div>
        <span>{label}</span>
        <select
          data-testid={selectTestId}
          onChange={onChange}
        >
          {dataOptions.map((option, i) => (
            <option
              data-testid={selectOptionTestId}
              value={option.value}
              key={option.id || `option-${i}`}
            >
              {option.label}
            </option>))}
          {children}
        </select>
      </div>
    );
  }),
  TextArea: jest.fn(({
    label,
    onChange,
    ...rest
  }) => {
    return (
      <div>
        <label htmlFor="textField">{label}</label>
        <textarea
          id="textField"
          onChange={onChange}
          {...rest}
        />
      </div>
    );
  }),
  TextField: jest.fn(({
    label,
    onChange,
    validate = jest.fn(),
    ...rest
  }) => {
    const handleChange = (e) => {
      validate(e.target.value);
      onChange(e);
    };

    return (
      <div>
        <label htmlFor="textField">{label}</label>
        <input
          id="textField"
          onChange={handleChange}
          {...rest}
        />
      </div>
    );
  }),
}));
