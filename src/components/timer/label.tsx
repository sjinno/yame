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
    <div className="text-center">
      <input
        type="text"
        value={label}
        placeholder="label"
        readOnly={labelReadonly}
        onFocus={() => onReadonlyUpdate(false)}
        onBlur={() => onReadonlyUpdate(true)}
        onChange={(e) => onLabelUpdate(e.target.value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && (e.target as HTMLInputElement).blur()
        }
        autoCorrect="off"
        className="focus:bg-amber-100 text-center"
      />
    </div>
  );
}
