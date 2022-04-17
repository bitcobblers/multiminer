import { Coin } from '../../../models';
import * as config from '../../../renderer/services/AppSettingsService';
import { selectCoin } from '../../../renderer/services/strategies/Skynet';

describe('Skynet Coin Selection', () => {
  it('Should return same coin if only one coin is enabled.', async () => {
    // Arrange.
    const coins: Coin[] = [
      {
        symbol: 'ETH',
        wallet: null,
        enabled: true,
        duration: 1,
      },
    ];

    jest.spyOn(config, 'getCoins').mockReturnValue(Promise.resolve(coins));

    // Act.
    const result = await selectCoin('ETH');

    // Assert.
    expect(result.symbol).toBe('ETH');
  });

  it('Should alternate coins if two or more coins is enabled.', async () => {
    // Arrange.
    const coins: Coin[] = [
      {
        symbol: 'ETH',
        wallet: null,
        enabled: true,
        duration: 1,
      },
      {
        symbol: 'TRX',
        wallet: null,
        enabled: true,
        duration: 1,
      },
    ];

    jest.spyOn(config, 'getCoins').mockReturnValue(Promise.resolve(coins));

    // Act.
    const result1 = await selectCoin('ETH');
    const result2 = await selectCoin('TRX');

    // Assert.
    expect(result1.symbol).toBe('TRX');
    expect(result2.symbol).toBe('ETH');
  });
});
