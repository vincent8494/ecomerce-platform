import { ProgressEvent } from '../types/progressEvent';

export interface AxiosProgressEvent extends ProgressEvent {
  loaded: number;
  total: number;
  lengthComputable: boolean;
  target: EventTarget;
  type: string;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  returnValue: boolean;
  srcElement: EventTarget | null;
  timeStamp: number;
  currentTarget: EventTarget | null;
  which: number;
}
