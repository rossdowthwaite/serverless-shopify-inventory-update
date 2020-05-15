import { asyncForEach } from './asyncForEach';

describe('asyncForEach', () => {
  let result: string[] = [];
  let data: string[];

  beforeEach(() => {
    data = ['zero', 'one', 'two', 'three', 'four'];
  });

  it('should synchronously loop through the array', async () => {
    result = [];
    await asyncForEach(data, async (item: string) => {
      await new Promise(resolve => {
        setTimeout(() => {
          result.push(item);
          resolve();
        }, 100);
      });
    });

    expect(result[0]).toEqual('zero');
    expect(result[1]).toEqual('one');
    expect(result[2]).toEqual('two');
    expect(result[3]).toEqual('three');
    expect(result[4]).toEqual('four');
  });

  it('should break loop if one fails', async () => {
    result = [];
    let counter = 0;
    try {
      await asyncForEach(data, async (item: string) => {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (counter === 3) {
              reject();
            } else {
              counter++;
              result.push(item);
              resolve();
            }
          }, 100);
        });
      });
    } catch (e) {}

    expect(result[0]).toEqual('zero');
    expect(result[1]).toEqual('one');
    expect(result[2]).toEqual('two');
    expect(result.length).toEqual(3);
  });
});
