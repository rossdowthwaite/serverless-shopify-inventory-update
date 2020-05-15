import { ConnectConfig, SFTPWrapper } from 'ssh2';
import { TransferOptions } from 'ssh2-streams';
import SftpClient from 'ssh2-sftp-client';

export function mockSFTPServer(): SftpClient {
  return new SftpClient();
}

export function getMockSftpClient(): SftpClient {
  return {
    connect: (options: ConnectConfig) => Promise.resolve(<SFTPWrapper>{}),
    list: (remoteFilePath: string) => Promise.resolve([]),
    exists: (remotePath: string) => Promise.resolve(true),
    stat: (remotePath: string) =>
      Promise.resolve({
        mode: 1,
        owner: 1,
        group: 1,
        size: 1,
        accessTime: 1,
        modifyTime: 1,
      }),
    get: (
      path: string,
      dst?: string | NodeJS.ReadableStream,
      options?: boolean
    ) => Promise.resolve(''),
    fastGet: (
      remoteFilePath: string,
      localPath: string,
      options?: TransferOptions
    ) => Promise.resolve(''),
    put: (
      input: string | Buffer | NodeJS.ReadableStream,
      remoteFilePath: string,
      options?: TransferOptions
    ) => Promise.resolve(''),
    fastPut: (
      localPath: string,
      remoteFilePath: string,
      options?: TransferOptions
    ) => Promise.resolve(''),
    mkdir: (remoteFilePath: string, recursive?: boolean) => Promise.resolve(''),
    rmdir: (remoteFilePath: string, recursive?: boolean) => Promise.resolve(''),
    delete: (remoteFilePath: string) => Promise.resolve(''),
    rename: (remoteSourcePath: string, remoteDestPath: string) =>
      Promise.resolve(''),
    chmod: (remotePath: string, mode: number | string) => Promise.resolve(''),
    append: (
      input: Buffer | NodeJS.ReadableStream,
      remotePath: string,
      options?: TransferOptions
    ) => Promise.resolve(''),
    end: () => Promise.resolve(),
    on: (event: string, callback: (...args: any[]) => void) => {},
  };
}
