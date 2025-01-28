import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  headerChildren: ReactNode;
  bodyChildren: ReactNode;
  footerChildren: ReactNode;
}

export function TimerCard({
  headerChildren,
  bodyChildren,
  footerChildren,
}: Props) {
  const roundTlTr = ''; // 'rounded-tl-md rounded-tr-md';
  const roundBlBrStyle = ''; // 'rounded-bl-2xl rounded-br-2xl';

  return (
    <div
      className={clsx(
        'card',
        'w-[256px] h-[144px] my-2 text-sm',
        roundBlBrStyle,
        roundTlTr,
        'border-1 border-solid border-zinc-600'
      )}
    >
      <div className={clsx('card_header card_child', 'h-[20%]', roundTlTr)}>
        {headerChildren}
      </div>
      <div className={clsx('card_body card_child', 'h-[60%]')}>
        {bodyChildren}
      </div>
      <div
        className={clsx('card_footer card_child', 'h-[20%]', roundBlBrStyle)}
      >
        {footerChildren}
      </div>
    </div>
  );
}
