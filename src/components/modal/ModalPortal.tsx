import { createPortal } from 'react-dom';
import { type ReactNode, useEffect, useRef } from 'react';

export function ModalPortal({ children }: { children: ReactNode }) {
  const elRef = useRef<HTMLElement | null>(null);
  if (!elRef.current)
    elRef.current = document.getElementById('modal-root') as HTMLElement;

  useEffect(() => {
    if (!elRef.current) {
      const node = document.createElement('div');
      node.id = 'modal-root';
      document.body.appendChild(node);
      elRef.current = node;
    }
  }, [children]);

  return elRef.current ? createPortal(children, elRef.current) : null;
}
