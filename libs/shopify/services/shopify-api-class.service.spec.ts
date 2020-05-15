import { ShopifyApi } from './shopify-api-class.service';

// Libs
import { Logger } from '../../logger';
import { EnvService } from '../../utils/env.service';

// Helpers
import * as Helpers from './helpers/shopify-api-class.service.spec.helper';

// Interfaces
import { ShopifyProject } from '../interfaces/shopify';

// 3rd
import axios from 'axios';

describe('ShopifyApi', () => {
  let ShopifyApiService: any;

  beforeEach(() => {
    spyOn(EnvService, 'getParam').and.callFake(function (arg: string) {
      switch (arg) {
        case 'SHOPIFY_PRIVATE_APP_PROJECT_NAME':
          return JSON.stringify({
            username: 'testUsername',
            password: 'testPassword',
            shop: 'testShop',
            version: 'testVersion',
          });
        case 'SHOPIFY_PRIVATE_APP_TEST_ERROR':
          return 'an un-parsable string';
        default:
          return '';
      }
    });
    spyOn(Logger, 'info');
  });

  describe('CRUD tests', () => {
    beforeEach(() => {
      ShopifyApiService = new ShopifyApi('project_name');
    });

    describe('get', () => {
      it('should attempt to make a resource request and fail', async () => {
        const resource = '/shop.json';
        spyOn(ShopifyApiService, 'constructRequestUrl').and.returnValue(
          `${Helpers.getMockBaseUrl()}${resource}`
        );
        spyOn(ShopifyApiService, 'handleError');

        await ShopifyApiService.get(resource);

        expect(ShopifyApiService.handleError).toHaveBeenCalled();
      });

      it('should return the data', async () => {
        const resource = '/shop.json';
        spyOn(axios, 'get').and.returnValue(Promise.resolve({ data: 'data' }));
        spyOn(ShopifyApiService, 'constructRequestUrl').and.returnValue(
          `${Helpers.getMockBaseUrl()}${resource}`
        );

        const result = await ShopifyApiService.get(resource);

        expect(result).toEqual('data');
      });
    });

    describe('post', () => {
      let postParams: any;
      beforeEach(() => {
        postParams = {
          fulfillment: {
            location_id: '123',
            notify_customer: false,
            shipment_status: 'failure',
            status: 'failure',
            tracking_company: 'Courier Ltd',
            tracking_numbers: ['1234'],
            tracking_urls: ['http://not-a-real-url/'],
          },
        };
      });

      it('should attempt to make a resource request and fail', async () => {
        const resource = '/shop.json';
        spyOn(ShopifyApiService, 'constructRequestUrl').and.returnValue(
          `${Helpers.getMockBaseUrl()}${resource}`
        );
        spyOn(ShopifyApiService, 'handleError');

        await ShopifyApiService.post(resource, postParams);

        expect(ShopifyApiService.handleError).toHaveBeenCalled();
      });

      it('should return the data', async () => {
        const resource = '/shop.json';
        spyOn(axios, 'post').and.returnValue(Promise.resolve({ data: 'data' }));
        spyOn(ShopifyApiService, 'constructRequestUrl').and.returnValue(
          `${Helpers.getMockBaseUrl()}${resource}`
        );

        const result = await ShopifyApiService.post(resource, postParams);

        expect(result).toEqual('data');
      });
    });

    describe('put', () => {
      it('should attempt to make a resource request and fail', async () => {
        const resource = '/shop.json';
        spyOn(ShopifyApiService, 'constructRequestUrl').and.returnValue(
          `${Helpers.getMockBaseUrl()}${resource}`
        );
        spyOn(ShopifyApiService, 'handleError');
        await ShopifyApiService.put(resource, {
          order: {
            id: 123,
            note: 'Test note',
          },
        });
        expect(ShopifyApiService.handleError).toHaveBeenCalled();
      });

      it('should return the data', async () => {
        const resource = '/shop.json';
        spyOn(axios, 'put').and.returnValue(Promise.resolve({ data: 'data' }));
        spyOn(ShopifyApiService, 'constructRequestUrl').and.returnValue(
          `${Helpers.getMockBaseUrl()}${resource}`
        );

        const result = await ShopifyApiService.put(resource, {
          order: {
            id: 123,
            note: 'Test note',
          },
        });

        expect(result).toEqual('data');
      });
    });

    describe('delete', () => {
      it('should attempt to delete and fail', async () => {
        const resource = '/thingthing.json';
        spyOn(ShopifyApiService, 'constructRequestUrl').and.returnValue(
          `${Helpers.getMockBaseUrl()}${resource}`
        );
        spyOn(ShopifyApiService, 'handleError');
        await ShopifyApiService.delete(resource);
        expect(ShopifyApiService.handleError).toHaveBeenCalled();
      });

      it('should return the data', async () => {
        const resource = '/shop.json';
        spyOn(axios, 'delete').and.returnValue(
          Promise.resolve({ data: 'data' })
        );
        spyOn(ShopifyApiService, 'constructRequestUrl').and.returnValue(
          `${Helpers.getMockBaseUrl()}${resource}`
        );

        const result = await ShopifyApiService.delete(resource);

        expect(result).toEqual('data');
      });
    });
  });

  describe('Private methods', () => {
    describe('constructRequestUrl', () => {
      it('should call getMockBaseUrl', () => {
        ShopifyApiService = new ShopifyApi('project_name');

        spyOn(ShopifyApiService, 'getBaseUrl');
        ShopifyApiService.constructRequestUrl('/some/resource.json');
        expect(ShopifyApiService.getBaseUrl).toHaveBeenCalled();
      });

      it('should construct the full request URL', () => {
        ShopifyApiService = new ShopifyApi('project_name');
        const result = ShopifyApiService.constructRequestUrl(
          '/some/resource.json'
        );
        expect(result).toEqual(
          'https://testUsername:testPassword@testShop.myshopify.com/admin/api/testVersion/some/resource.json'
        );
      });
    });

    describe('getBaseUrl', () => {
      it('should return the baseUrl in the correct format', () => {
        ShopifyApiService = new ShopifyApi('project_name');
        const result = ShopifyApiService.getBaseUrl();
        expect(result).toEqual(
          'https://testUsername:testPassword@testShop.myshopify.com/admin/api/testVersion'
        );
      });

      it('should return the baseUrl in the correct format for different project', () => {
        ShopifyApiService = new ShopifyApi('project_name');
        const result = ShopifyApiService.getBaseUrl();
        expect(result).toEqual(
          'https://testUsername:testPassword@testShop.myshopify.com/admin/api/testVersion'
        );
      });
    });

    describe('getAppKeys', () => {
      it('Should call EnvService.getParam with the correct param', () => {
        ShopifyApiService = new ShopifyApi('project_name');
        ShopifyApiService.getAppKeys();

        expect(EnvService.getParam).toHaveBeenCalledWith(
          'SHOPIFY_PRIVATE_APP_PROJECT_NAME'
        );
      });

      it('Should call EnvService.getParam with the correct param', () => {
        ShopifyApiService = new ShopifyApi('project_name');
        ShopifyApiService.getAppKeys();

        expect(EnvService.getParam).toHaveBeenCalledWith(
          'SHOPIFY_PRIVATE_APP_PROJECT_NAME'
        );
      });

      it('Should call log an error when keys arent returned', () => {
        spyOn(Logger, 'error');

        try {
          ShopifyApiService = new ShopifyApi(<ShopifyProject>'TEST_ERROR');
        } catch (e) {}

        expect(Logger.error).toHaveBeenCalled();
      });
    });

    describe('handleError', () => {
      let shopifyError: any;

      beforeEach(() => {
        ShopifyApiService = new ShopifyApi('project_name');

        shopifyError = {
          message: 'Request failed with status code 404',
          response: {
            status: 404,
            statusText: 'Not Found',
            data: {
              errors: 'the actual shopify error',
            },
          },
        };
      });

      it('Should parse the incoming shopify error, and throw with the correct message', () => {
        let errMsg;
        try {
          ShopifyApiService.handleError(shopifyError);
        } catch (error) {
          errMsg = error.message;
        }

        expect(errMsg).toEqual(
          '{"status":404,"statusText":"Not Found","message":"the actual shopify error"}'
        );
      });

      it('Should throw a regular error if no response', () => {
        spyOn(JSON, 'stringify');

        const e = new Error('wahhh');
        let errMsg;
        try {
          ShopifyApiService.handleError(e);
        } catch (error) {
          errMsg = error.message;
        }

        expect(errMsg).toEqual('wahhh');
        expect(JSON.stringify).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('getLocationId', () => {
    it('should return the location ID', () => {
      ShopifyApiService = new ShopifyApi('project_name');
      ShopifyApiService.location_id = 'some_id';
      const id = ShopifyApiService.getLocationId();

      expect(id).toEqual('some_id');
    });
  });
});
