import { Coin } from '../../../models';
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

    // Act.
    const result = selectCoin(null, coins);

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

    // Act.
    const result = selectCoin('unknown', coins);

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

    // Act.
    const result = selectCoin('TRX', coins);

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

    // Act.
    const result = selectCoin('ETH', coins);

    // Assert.
    expect(result.symbol).toBe('TRX');
  });
});
