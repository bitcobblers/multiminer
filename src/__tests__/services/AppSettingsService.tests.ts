import * as settings from '../../renderer/services/AppSettingsService';
import { settingsApi } from '../../shared/SettingsApi';
import { Wallet, Coin, Miner, AppSettings } from '../../models/Configuration';

describe('App Settings Service', () => {
  describe('Wallets tests', () => {
    it('No content returns default setting', async () => {
      // Arrange.
      jest.spyOn(settingsApi, 'read').mockReturnValue(Promise.resolve(''));

      // Act.
      const result = await settings.getWallets();

      // Assert.
      expect(result).toBe(settings.defaults.wallets);
    });

    it('Returns stored content', async () => {
      // Arrange.
      const wallets: Wallet[] = [
        {
          id: '12345',
          name: 'test',
          blockchain: 'ETH',
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
    it('No content returns default setting', async () => {
      // Arrange.
      jest.spyOn(settingsApi, 'read').mockReturnValue(Promise.resolve(''));

      // Act.
      const result = await settings.getCoins();

      // Assert.
      expect(result).toBe(settings.defaults.coins);
    });

    it('Returns stored content', async () => {
      // Arrange.
      const coins: Coin[] = [
        {
          symbol: 'ETH',
          wallet: 'wallet',
          enabled: true,
          duration: 1,
          referral: '',
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
    it('No content returns default setting', async () => {
      // Arrange.
      jest.spyOn(settingsApi, 'read').mockReturnValue(Promise.resolve(''));

      // Act.
      const result = await settings.getMiners();

      // Assert.
      expect(result).toBe(settings.defaults.miners);
    });

    it('Returns stored content', async () => {
      // Arrange.
      const miners: Miner[] = [
        {
          id: 'x',
          kind: 'lolminer',
          name: 'miner',
          enabled: true,
          installationPath: '',
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
    it('No content returns default setting', async () => {
      // Arrange.
      jest.spyOn(settingsApi, 'read').mockReturnValue(Promise.resolve(''));

      // Act.
      const result = await settings.getAppSettings();

      // Assert.
      expect(result).toBe(settings.defaults.settings);
    });

    it('Returns stored content', async () => {
      // Arrange.
      const appSettings: AppSettings = {
        settings: {
          workerName: 'worker',
          updateInterval: 1,
          cooldownInterval: 30,
          proxy: '',
        },
        pools: {
          ethash: '',
          etchash: '',
          kawpaw: '',
          randomx: '',
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
