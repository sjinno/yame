interface Props {
  label: string;
  labelReadonly: boolean;
  onLabelUpdate: (label: string) => void;
  onReadonlyUpdate: (readonly: boolean) => void;
}

export function Label({
  label,
  labelReadonly,
  onLabelUpdate,
  onReadonlyUpdate,
}: Props) {
  return (
    <div style={{ paddingBlock: '5px' }}>
      <input
        type="text"
        value={label}
        placeholder="label"
        readOnly={labelReadonly}
        onClick={() => onReadonlyUpdate(false)}
        onBlur={() => onReadonlyUpdate(true)}
        onChange={(e) => onLabelUpdate(e.target.value)}
        autoCorrect="off"
      />
    </div>
  );
}
