/**
 * Helper function to combine async and forEach functionality
 * @private
 * @static
 * @param  {*} array the array to loop through
 * @param  {*} callback the callback function
 * @return {void}
 */
export async function asyncForEach(
  array: any[],
  callback: Function
): Promise<any[]> {
  const results = [];
  for (let index = 0; index < array.length; index++) {
    results[index] = await callback(array[index], index, array);
  }
  return results;
}
