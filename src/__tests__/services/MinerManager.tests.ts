import { Miner, Coin, Wallet } from '../../models/Configuration';
import * as settings from '../../renderer/services/AppSettingsService';
import * as manager from '../../renderer/services/MinerManager';

describe('Miner Manager Service', () => {
  it('Should raise an error if no configured miners are available.', async () => {
    // Arrange.
    jest.spyOn(settings, 'getMiners').mockReturnValue(Promise.resolve([]));
    const onError = jest.fn();
    const onSuccess = jest.fn();

    // Act.
    await manager.selectCoin(onError, onSuccess);

    // Assert.
    expect(onError).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('Should raise an error if there are no enabled coins.', async () => {
    // Arrange.
    const miner: Miner = { id: '0', kind: 'lolminer', name: 'miner', enabled: true, installationPath: '', algorithm: 'ethash', parameters: '' };
    jest.spyOn(settings, 'getMiners').mockReturnValue(Promise.resolve([miner]));
    jest.spyOn(settings, 'getCoins').mockReturnValue(Promise.resolve([]));

    const onError = jest.fn();
    const onSuccess = jest.fn();

    // Act.
    await manager.selectCoin(onError, onSuccess);

    // Assert.
    expect(onError).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('Should raise an error if an unknown wallet is specified.', async () => {
    // Arrange.
    const miner: Miner = { id: '0', kind: 'lolminer', name: 'miner', enabled: true, installationPath: '', algorithm: 'ethash', parameters: '' };
    const coin: Coin = { symbol: 'ETH', wallet: 'unknown', enabled: true, duration: 1, referral: '' };

    jest.spyOn(settings, 'getMiners').mockReturnValue(Promise.resolve([miner]));
    jest.spyOn(settings, 'getCoins').mockReturnValue(Promise.resolve([coin]));
    jest.spyOn(settings, 'getWallets').mockReturnValue(Promise.resolve([]));

    const onError = jest.fn();
    const onSuccess = jest.fn();

    // Act.
    await manager.selectCoin(onError, onSuccess);

    // Assert.
    expect(onError).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('Should call onSuccess() if there are no configuration issues.', async () => {
    // Arrange.
    const miner: Miner = { id: '0', kind: 'lolminer', name: 'miner', enabled: true, installationPath: '', algorithm: 'ethash', parameters: '' };
    const coin: Coin = { symbol: 'ETH', wallet: 'mywallet', enabled: true, duration: 1, referral: '' };
    const wallet: Wallet = { id: '0', name: 'mywallet', blockchain: 'ETH', address: '0x12345', memo: '' };

    jest.spyOn(settings, 'getMiners').mockReturnValue(Promise.resolve([miner]));
    jest.spyOn(settings, 'getCoins').mockReturnValue(Promise.resolve([coin]));
    jest.spyOn(settings, 'getWallets').mockReturnValue(Promise.resolve([wallet]));

    const onError = jest.fn();
    const onSuccess = jest.fn();

    // Act.
    await manager.selectCoin(onError, onSuccess);

    // Assert.
    expect(onError).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });
});
