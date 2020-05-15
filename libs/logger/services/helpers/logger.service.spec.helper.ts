// Interfaces
import {
  ErrorOutput,
  WarnOutput,
  InfoOutput,
  DebugOutput,
} from '../../interfaces/logger';

export function getMockErrorOutput(): ErrorOutput {
  return {
    type: 'error',
    icon: '💥💥💥',
    environment: 'not-set',
    project: 'unit-testing',
    errorType: 'Error',
    message: 'error message',
    stack: 'stack',
  };
}

export function getMockInfoOutput(): InfoOutput {
  return {
    type: 'info',
    icon: '💥💥💥',
    environment: 'not-set',
    project: 'unit-testing',
    message: 'some info message to log',
  };
}

export function getMockDebugOutput(): DebugOutput {
  return {
    type: 'debug',
    icon: '🐞',
    environment: 'not-set',
    project: 'unit-testing',
    message: 'some info message to log',
  };
}

export function getMockInfoOutputWithData(): InfoOutput {
  return {
    type: 'info',
    icon: '💬',
    environment: 'not-set',
    project: 'unit-testing',
    message: 'some info message to log',
  };
}

export function getMockWarnOutput(): WarnOutput {
  return {
    type: 'warn',
    icon: '🔔🔔🔔',
    environment: 'not-set',
    project: 'unit-testing',
    message: 'some warn message to log',
  };
}

export function getMockWarnOutputWithData(): WarnOutput {
  return {
    type: 'warn',
    icon: '🔔🔔🔔',
    environment: 'not-set',
    project: 'unit-testing',
    message: 'some info message to log',
  };
}
