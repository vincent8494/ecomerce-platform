import { ProgressEvent } from '../types/progressEvent';

export interface AxiosProgressEvent extends ProgressEvent {
  loaded: number;
  total: number;
  lengthComputable: boolean;
}
