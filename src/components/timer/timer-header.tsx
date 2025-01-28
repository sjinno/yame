import { Label, LabelProps } from './label';

export function TimerHeader({
  label,
  labelReadonly,
  onLabelUpdate,
  onReadonlyUpdate,
}: LabelProps) {
  return (
    <div className="relative h-full">
      <div className="w-[80%] h-full flex justify-center items-center mx-auto">
        <Label
          label={label}
          labelReadonly={labelReadonly}
          onLabelUpdate={onLabelUpdate}
          onReadonlyUpdate={onReadonlyUpdate}
        />
      </div>
    </div>
  );
}
