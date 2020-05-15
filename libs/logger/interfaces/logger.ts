export interface LogOutput {
  type: LogType;
  icon: string;
  environment: EnvType;
  project: string;
  message: string | number | any[] | object;
}

export interface ErrorOutput extends LogOutput {
  type: 'error';
  errorType: string;
  errorStatus?: string;
  filename?: string;
  lineNumber?: string;
  columnNumber?: string;
  stack: string;
}

export interface WarnOutput extends LogOutput {
  type: 'warn';
}

export interface InfoOutput extends LogOutput {
  type: 'info';
}

export interface DebugOutput extends LogOutput {
  type: 'debug';
}

export type LogType = 'error' | 'warn' | 'info' | 'debug';
export type EnvType =
  | 'prod'
  | 'preprod'
  | 'test'
  | 'test-auto'
  | 'dev'
  | 'not-set';
