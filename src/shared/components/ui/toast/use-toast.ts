import * as React from 'react';
import type { ToastProps } from './toast';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 3000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

let count = 0;
const genId = () => (++count).toString();

type State = { toasts: ToasterToast[] };

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(toasts: ToasterToast[]) {
  memoryState = { toasts };
  listeners.forEach(l => l(memoryState));
}

function toast(props: Omit<ToasterToast, 'id'>) {
  const id = genId();
  const newToast: ToasterToast = { ...props, id };
  const next = [newToast, ...memoryState.toasts].slice(0, TOAST_LIMIT);
  dispatch(next);
  setTimeout(() => {
    dispatch(memoryState.toasts.filter(t => t.id !== id));
  }, TOAST_REMOVE_DELAY);
  return id;
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);
  return { ...state, toast };
}

export { useToast, toast };
