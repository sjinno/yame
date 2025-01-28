import clsx from 'clsx';

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
    <input
      type="text"
      value={label}
      placeholder="Label"
      readOnly={labelReadonly}
      onFocus={() => onReadonlyUpdate(false)}
      onBlur={() => onReadonlyUpdate(true)}
      onChange={(e) => onLabelUpdate(e.target.value)}
      onKeyDown={(e) =>
        e.key === 'Enter' && (e.target as HTMLInputElement).blur()
      }
      autoCorrect="off"
      className={clsx(
        'text-center w-[80%] mx-auto my-1 py-1',
        'border-1 border-solid border-zinc-600',
        'focus:outline-1 focus:outline-solid focus:outline-blue-600'
      )}
    />
  );
}
