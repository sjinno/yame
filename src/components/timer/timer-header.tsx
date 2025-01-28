import clsx from 'clsx';
import { Label } from './label';

export interface LabelProps {
  label: string;
  labelReadonly: boolean;
  updateLabel: (label: string) => void;
  updateLabelReadonly: (readonly: boolean) => void;
}

export function TimerHeader({
  label,
  labelReadonly,
  updateLabel,
  updateLabelReadonly,
}: LabelProps) {
  return (
    <div className="relative h-full">
      <div className="h-full flex justify-center align-middle">
        <Label
          label={label}
          labelReadonly={labelReadonly}
          onLabelUpdate={updateLabel}
          onReadonlyUpdate={updateLabelReadonly}
        />
      </div>
    </div>
  );
}
