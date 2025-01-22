interface Props {
  label: string;
  labelReadonly: boolean;
  setLabel: React.Dispatch<React.SetStateAction<string>>;
  setLabelReadonly: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Label = ({
  label,
  labelReadonly,
  setLabel,
  setLabelReadonly,
}: Props) => {
  return (
    <div style={{ paddingBlock: '5px' }}>
      <input
        type="text"
        value={label}
        placeholder="label"
        readOnly={labelReadonly}
        onClick={() => setLabelReadonly(false)}
        onBlur={() => setLabelReadonly(true)}
        onChange={(e) => setLabel(e.target.value)}
        autoCorrect="off"
      />
    </div>
  );
};
