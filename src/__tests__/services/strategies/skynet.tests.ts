import { Coin } from '../../../models';
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

    // Act.
    const result = selectCoin('ETH', coins);

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

    // Act.
    const result1 = selectCoin('ETH', coins);
    const result2 = selectCoin('TRX', coins);

    // Assert.
    expect(result1.symbol).toBe('TRX');
    expect(result2.symbol).toBe('ETH');
  });
});
