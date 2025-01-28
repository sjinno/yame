import clsx from 'clsx';
import { ReactNode } from 'react';
import { TimerStatus } from '../../types';
import { Trash2Icon } from 'lucide-react';

interface Props {
  timerStatus: TimerStatus;
  onRemove: () => void;
  headerChildren: ReactNode;
  bodyChildren: ReactNode;
  footerChildren: ReactNode;
}

export function TimerCard({
  timerStatus,
  onRemove,
  headerChildren,
  bodyChildren,
  footerChildren,
}: Props) {
  return (
    <div
      className={clsx(
        'card',
        'w-[256px] h-[144px] my-4 mx-auto text-sm relative',
        'border-1 border-solid border-zinc-600',
        'rounded-[10px]',
        'bg-[#edede9] p-1.5'
      )}
    >
      <div className={clsx('card_header card_child', 'h-[25%]')}>
        {headerChildren}
      </div>
      <div className={clsx('card_body card_child', 'h-[50%]')}>
        {bodyChildren}
      </div>
      <div className={clsx('card_footer card_child', 'h-[25%]')}>
        {footerChildren}
      </div>
      <button
        className="absolute top-[-11px] right-[-11px] w-[24px] h-[24px] rounded-full bg-red-600 text-white z-10"
        // TODO: show a toast saying that it has to be paused before doing the remove action or you can change the behavior in the user settings
        disabled={timerStatus === 'ongoing'}
        onClick={onRemove}
      >
        <Trash2Icon className="w-full h-full scale-75" />
      </button>
    </div>
  );
}
