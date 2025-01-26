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
    <div className="ml-0.5">
      <input
        type="text"
        value={label}
        placeholder="label"
        readOnly={labelReadonly}
        onFocus={() => onReadonlyUpdate(false)}
        onBlur={() => onReadonlyUpdate(true)}
        onChange={(e) => onLabelUpdate(e.target.value)}
        autoCorrect="off"
        className="focus:bg-amber-100 focus:p-2 focus:text-xl"
      />
    </div>
  );
}
