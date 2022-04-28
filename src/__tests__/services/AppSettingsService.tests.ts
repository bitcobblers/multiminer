import * as settings from '../../renderer/services/AppSettingsService';
import { settingsApi } from '../../shared/SettingsApi';
import { Wallet, Coin, Miner, AppSettings } from '../../models';

describe('App Settings Service', () => {
  describe('Wallets tests', () => {
    it('Returns stored content', async () => {
      // Arrange.
      const wallets: Wallet[] = [
        {
          id: '12345',
          name: 'test',
          network: 'ETH',
          address: '0x12345',
          memo: '',
        },
      ];

      jest.spyOn(settingsApi, 'read').mockReturnValue(Promise.resolve(JSON.stringify(wallets)));

      // Act.
      const result = await settings.getWallets();

      // Assert.
      expect(result).toStrictEqual(wallets);
    });
  });

  describe('Coins tests', () => {
    it('Returns stored content', async () => {
      // Arrange.
      const coins: Coin[] = [
        {
          symbol: 'ETH',
          wallet: 'wallet',
          enabled: true,
          duration: 1,
        },
      ];

      jest.spyOn(settingsApi, 'read').mockReturnValue(Promise.resolve(JSON.stringify(coins)));

      // Act.
      const result = await settings.getCoins();

      // Assert.
      expect(result).toStrictEqual(coins);
    });
  });

  describe('Miners tests', () => {
    it('Returns stored content', async () => {
      // Arrange.
      const miners: Miner[] = [
        {
          id: 'x',
          kind: 'lolminer',
          name: 'miner',
          version: '',
          algorithm: 'ethash',
          parameters: '',
        },
      ];

      jest.spyOn(settingsApi, 'read').mockReturnValue(Promise.resolve(JSON.stringify(miners)));

      // Act.
      const result = await settings.getMiners();

      // Assert.
      expect(result).toStrictEqual(miners);
    });
  });

  describe('Settings tests', () => {
    it('Returns stored content', async () => {
      // Arrange.
      const appSettings: AppSettings = {
        settings: {
          workerName: 'worker',
          defaultMiner: '',
          coinStrategy: 'normal',
          proxy: '',
        },
        pools: {
          ethash: '',
          etchash: '',
          kawpow: '',
          randomx: '',
        },
        appearance: {
          theme: 'light',
        },
      };

      jest.spyOn(settingsApi, 'read').mockReturnValue(Promise.resolve(JSON.stringify(appSettings)));

      // Act.
      const result = await settings.getAppSettings();

      // Assert.
      expect(result).toStrictEqual(appSettings);
    });
  });
});
