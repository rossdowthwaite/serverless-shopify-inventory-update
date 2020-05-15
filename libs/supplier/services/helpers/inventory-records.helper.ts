import { SupplierInventory } from '../../interfaces/inventory';

/**
 * Mock Inventory Records
 * NOTE:
 * - Structure not confirmed and needs validating by the Supplier,
 * - for the sake of testing, only including the fields we need
 *
 *
 * @export
 * @returns {SupplierInventory[]}
 */
export function getMockInventoryRecords(): SupplierInventory[] {
  return [
    {
      Cust_Prod_Number: '10258456@Store',
      Available_To_Order: '123',
    },
    {
      Cust_Prod_Number: '10245837@Store',
      Available_To_Order: '50',
    },
    {
      Cust_Prod_Number: '10278937@Store',
      Available_To_Order: '74',
    },
    {
      Cust_Prod_Number: '10123837@Store',
      Available_To_Order: '23',
    },
    {
      Cust_Prod_Number: '10276837@Store',
      Available_To_Order: '10506',
    },
  ];
}

export function mockInventoryArray(): SupplierInventory[] {
  return [
    { Cust_Prod_Number: '16061325213760@Store', Available_To_Order: '486' },
    { Cust_Prod_Number: '16061327769664@Store', Available_To_Order: '24' },
    { Cust_Prod_Number: '16061329735744@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '30299727102016@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '30741230059584@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '30741230125120@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '30741230223424@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '30741455175744@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '16061328195648@Store', Available_To_Order: '97' },
    { Cust_Prod_Number: '16061329080384@Store', Available_To_Order: '41' },
    { Cust_Prod_Number: '27586293465152@Store', Available_To_Order: '5' },
    { Cust_Prod_Number: '27586293366848@Store', Available_To_Order: '5' },
    { Cust_Prod_Number: '27586293399616@Store', Available_To_Order: '5' },
    { Cust_Prod_Number: '27586293432384@Store', Available_To_Order: '5' },
    { Cust_Prod_Number: '27668461060160@Store', Available_To_Order: '20' },
    { Cust_Prod_Number: '16061346512960@Store', Available_To_Order: '23' },
    { Cust_Prod_Number: '16061328261184@Store', Available_To_Order: '73' },
    { Cust_Prod_Number: '16061321084992@Store', Available_To_Order: '126' },
    { Cust_Prod_Number: '16061332455488@Store', Available_To_Order: '29' },
    { Cust_Prod_Number: '27614245355584@Store', Available_To_Order: '30' },
    { Cust_Prod_Number: '16061328425024@Store', Available_To_Order: '202' },
    { Cust_Prod_Number: '30412800524352@Store', Available_To_Order: '110' },
    { Cust_Prod_Number: '16061323608128@Store', Available_To_Order: '132' },
    { Cust_Prod_Number: '30412611977280@Store', Available_To_Order: '110' },
    { Cust_Prod_Number: '30412612042816@Store', Available_To_Order: '110' },
    { Cust_Prod_Number: '16061327835200@Store', Available_To_Order: '156' },
    { Cust_Prod_Number: '16061325410368@Store', Available_To_Order: '384' },
    { Cust_Prod_Number: '16061320265792@Store', Available_To_Order: '416' },
    { Cust_Prod_Number: '16061328326720@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '16061327802432@Store', Available_To_Order: '109' },
    { Cust_Prod_Number: '16061328359488@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '30282225811520@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '16061329276992@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '30299716485184@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '16061327999040@Store', Available_To_Order: '10' },
    { Cust_Prod_Number: '16061328457792@Store', Available_To_Order: '139' },
  ];
}
