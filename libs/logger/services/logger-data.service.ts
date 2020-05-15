import { EnvService } from '../../utils/env.service';

// Interfaces
import { EnvType } from '../interfaces/logger';

export abstract class LoggerDataService {
  /**
   * Gets the project name and environment
   * @static
   * @returns
   * @memberof Logger
   */
  static getMetadata(): { environment: EnvType; project: string } {
    let environment: EnvType;
    try {
      environment = <EnvType>EnvService.getParam('ENVIRONMENT', true);
    } catch (error) {
      environment = <EnvType>'not-set';
    }

    let project;
    try {
      project = EnvService.getParam('PROJECT', true);
    } catch (error) {
      project = 'not-set';
    }

    return {
      environment,
      project,
    };
  }
}
