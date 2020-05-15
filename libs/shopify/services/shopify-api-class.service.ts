import { Logger } from '../../logger';
import { EnvService } from '../../utils/env.service';
import axios from 'axios';

// Interfaces
import { ShopifyProject } from '../interfaces/shopify';
import { ShopifyUpdateInventoryReqBody } from '../interfaces/inventory';

export class ShopifyApi {
  private project: ShopifyProject;
  private username: string;
  private password: string;
  private shop: string;
  private version: string;
  private location_id: string;

  constructor(project: ShopifyProject) {
    this.project = project;
    const {
      username,
      password,
      shop,
      version,
      location_id,
    } = this.getAppKeys();
    this.username = username;
    this.password = password;
    this.shop = shop;
    this.version = version;
    this.location_id = location_id;
  }

  /**
   * Handles a GET request
   * @static
   * @param  {string} resource the resource endpoint
   * @return {void}
   * @memberof ShopifyApi
   */
  async get(resource: string): Promise<any> {
    const url = this.constructRequestUrl(resource);
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Axios POST request
   * @static
   * @param  {string} resource
   * @param  {CreateDiscountBody | FulfillmentBody | PriceRuleData} requestBody
   * @return Promise<any>
   * @memberof ShopifyApi
   */
  async post(
    resource: string,
    requestBody: ShopifyUpdateInventoryReqBody
  ): Promise<any> {
    const url = this.constructRequestUrl(resource);
    try {
      const response = await axios.post(url, requestBody);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Axios PUT request
   * @static
   * @param  {string} resource
   * @param  {any} requestBody
   * @return Promise<any>
   * @memberof ShopifyApi
   */
  async put(resource: string, requestBody: any): Promise<any> {
    const url = this.constructRequestUrl(resource);
    try {
      const response = await axios.put(url, requestBody);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Axios DELETE request
   *
   * @static
   * @param {string} resource
   * @returns Promise<any>
   * @memberof ShopifyApi
   */
  async delete(resource: string): Promise<any> {
    const url = this.constructRequestUrl(resource);
    try {
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Constructs the full request URL
   * @static
   * @param  {string} resource
   * @return
   * @memberof ShopifyApi
   */
  private constructRequestUrl(resource: string) {
    return `${this.getBaseUrl()}${resource}`;
  }

  /**
   * gets the baseUrl needed for each request
   * @static
   * @return string
   * @memberof ShopifyApi
   */
  public getBaseUrl(): string {
    return `https://${this.username}:${this.password}@${this.shop}.myshopify.com/admin/api/${this.version}`;
  }

  /**
   * Given a project name, set the app correct app keys
   * to access the API.
   *
   * @private
   * @memberof ShopifyApi
   */
  private getAppKeys() {
    const keys = EnvService.getParam(
      `SHOPIFY_PRIVATE_APP_${this.project.toUpperCase()}`
    );
    try {
      return JSON.parse(keys);
    } catch (e) {
      Logger.error(e);
    }
  }

  /**
   * Return the location ID for the loaded project.
   *
   * @public
   * @memberof ShopifyApi
   */
  public getLocationId() {
    return this.location_id;
  }

  /**
   * Handles the error message
   *
   * @static
   * @param {*} error
   * @memberof ShopifyApi
   */
  private handleError(error: any) {
    let errorMsg: string = error.message;

    // Parse Shopifys error response object to get to the point
    if (error.response) {
      errorMsg = JSON.stringify({
        status: error.response.status,
        statusText: error.response.statusText,
        message: error.response.data.errors
          ? error.response.data.errors
          : error.errorMsg,
      });
    }

    // TODO: Import and use our generic error types (to be defined)
    throw new Error(errorMsg);
  }
}
