interface Props {
  children?: string;
  href: string;
}

const LinkExternal = ({ children, href }: Props) => (
  <a className="LinkExternal" href={href} rel="noopener" target="_blank">
    {children}
  </a>
);

export default LinkExternal;
