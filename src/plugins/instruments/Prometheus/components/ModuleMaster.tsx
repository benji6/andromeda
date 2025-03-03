import ControlModule, {
  Range,
} from "../../../../components/organisms/ControlModule";

const ModuleMaster = ({ master: { gain, pan }, updateMaster }) => (
  <div>
    <ControlModule title="Master">
      <Range
        defaultValue={gain}
        label="Gain"
        max={1.5}
        onInput={(e) => updateMaster("gain", Number(e.currentTarget.value))}
      />
      <Range
        defaultValue={pan}
        label="Pan"
        min={-1}
        onInput={(e) => updateMaster("pan", Number(e.currentTarget.value))}
      />
    </ControlModule>
  </div>
);

export default ModuleMaster;
