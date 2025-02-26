import { useEffect, useRef } from "react";

interface Props {
  instance: {
    render: (element: HTMLElement | null) => void;
  };
}

const PluginMount = ({ instance }: Props) => {
  const elRef = useRef(null);

  useEffect(() => {
    instance.render(elRef.current);
  }, [instance]);

  return <div ref={elRef} />;
};

export default PluginMount;
