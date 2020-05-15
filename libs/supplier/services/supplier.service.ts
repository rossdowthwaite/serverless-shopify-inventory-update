// Libs
import { EnvService } from '../../utils/env.service';

import SftpClient from 'ssh2-sftp-client';

export abstract class SupplierService {
  /**
   * Get a new SftpClient instance
   * @static
   * @return SftpClient
   * @memberof SupplierService
   */
  static getSFTPClient(): SftpClient {
    return new SftpClient();
  }

  /**
   * Connects to the SFTP server
   * @static
   * @return Promise<SftpClient>
   * @memberof SupplierService
   */
  static async connectToSFTP(): Promise<SftpClient> {
    console.log('Connecting to Supplier SFTP server...');

    const host = EnvService.getParam('SFTP_HOST');
    const mode = EnvService.getParam('SFTP_MODE');
    const passOrKey = EnvService.getParam('SFTP_PASSWORD_OR_KEY');
    const port = +EnvService.getParam('SFTP_PORT');
    const username = EnvService.getParam('SFTP_USERNAME');

    const sftp = SupplierService.getSFTPClient();

    let connectionArgs: {
      host: string;
      port: number;
      privateKey?: string;
      password?: string;
      username: string;
    } = {
      host,
      port,
      username,
    };

    if (mode === 'key') {
      // Decode key from base64
      let privateKey = Buffer.from(passOrKey, 'base64');
      connectionArgs.privateKey = privateKey.toString('ascii');
    } else if (mode === 'password') {
      connectionArgs.password = passOrKey;
    } else {
      throw new Error(
        `Invalid SFTP connection mode "${mode}", failed to connect to SFTP server.`
      );
    }

    await sftp.connect(connectionArgs);
    console.log('Connected to Supplier SFTP server');

    return sftp;
  }
}
