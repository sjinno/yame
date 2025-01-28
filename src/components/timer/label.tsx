import clsx from 'clsx';

export interface LabelProps {
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
}: LabelProps) {
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
        'text-center w-full py-0.5',
        'border-1 border-solid border-zinc-600',
        'focus:outline-1 focus:outline-solid focus:outline-blue-600 focus:border-transparent focus:outline-offset-0'
      )}
    />
  );
}
