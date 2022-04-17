import { Coin } from '../../../models';
import * as config from '../../../renderer/services/AppSettingsService';
import { selectCoin } from '../../../renderer/services/strategies/Normal';

describe('Normal Coin Selection', () => {
  it('Should return first coin if no current coin given', async () => {
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
    const result = await selectCoin(null);

    // Assert.
    expect(result.symbol).toBe('ETH');
  });

  it('Should return first coin if unknown coin given', async () => {
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
    const result = await selectCoin('unknown');

    // Assert.
    expect(result.symbol).toBe('ETH');
  });

  it('Should return first coin if the last coin was given', async () => {
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
    const result = await selectCoin('TRX');

    // Assert.
    expect(result.symbol).toBe('ETH');
  });

  it('Should return next coin in the list', async () => {
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
    const result = await selectCoin('ETH');

    // Assert.
    expect(result.symbol).toBe('TRX');
  });
});
