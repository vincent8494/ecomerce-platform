import { AxiosProgressEvent } from 'axios';

export interface ProgressEvent extends AxiosProgressEvent {
  lengthComputable?: boolean;
  loaded?: number;
  total?: number;
  target?: EventTarget;
  bubbles?: boolean;
  cancelBubble?: boolean;
  cancelable?: boolean;
  currentTarget?: EventTarget;
  defaultPrevented?: boolean;
  eventPhase?: number;
  isTrusted?: boolean;
  returnValue?: boolean;
  srcElement?: EventTarget;
  timeStamp?: number;
  trusted?: boolean;
  type?: string;
  which?: number;
  composed?: boolean;
  composedPath?: () => EventTarget[];
  initEvent?: (typeArg: string, bubblesArg: boolean, cancelableArg: boolean) => void;
  preventDefault?: () => void;
  stopPropagation?: () => void;
  stopImmediatePropagation?: () => void;
  NONE?: number;
  CAPTURING_PHASE?: number;
  AT_TARGET?: number;
  BUBBLING_PHASE?: number;
}

export type AxiosProgressEvent = ProgressEvent;

export default ProgressEvent;
