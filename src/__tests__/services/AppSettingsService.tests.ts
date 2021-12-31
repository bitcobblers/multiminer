import { SettingsApi } from '../../renderer/api';
import { AppSettingsService } from '../../renderer/services/AppSettingsService';

describe('App Settings Service', () => {
  it('should return default on empty string.', async () => {
    // Arrange.
    const api: SettingsApi = {
      readSettings: () => Promise.resolve(''),
      writeSettings: () => Promise.resolve(),
    };

    const service = new AppSettingsService(api);

    // Act.
    const result = await service.getSettings();

    // Assert.
    expect(result).toEqual(AppSettingsService.DefaultSettings);
  });

  it('should not call api when saving null settings.', async () => {
    // Arrange.
    const api: SettingsApi = {
      readSettings: () => Promise.resolve(''),
      writeSettings: () => Promise.resolve(),
    };

    const spy = jest.spyOn(api, 'writeSettings');
    const settings = AppSettingsService.DefaultSettings;
    const service = new AppSettingsService(api);

    // Act.
    await service.saveSettings(settings);

    // Assert.
    expect(spy).toHaveBeenCalled();
  });
});
