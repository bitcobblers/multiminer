import { renderHook } from '@testing-library/react-hooks';
import { AppSettings } from '../../models';
import { useProfile } from '../../renderer/hooks';

import * as settings from '../../renderer/services/AppSettingsService';

describe('Profile Hook', () => {
  const defaultAppSettings: AppSettings = {
    settings: {
      workerName: '',
      defaultMiner: 'default',
      coinStrategy: 'normal',
      proxy: '',
    },
    appearance: {
      theme: 'light',
    },
    pools: {
      ethash: '',
      etchash: '',
      kawpow: '',
      autolykos2: '',
      randomx: '',
    },
  };

  it('Returns appSettings setting by default.', async () => {
    // Arrange.
    jest.spyOn(settings, 'getAppSettings').mockResolvedValue(defaultAppSettings);

    // Act.
    const { result, waitForNextUpdate } = renderHook(() => useProfile());
    await waitForNextUpdate();

    // Assert.
    expect(result.current).toBe('default');
  });

  it('Updates profile when configuration changes.', () => {
    // Arrange.
    const updatedSettings: AppSettings = {
      settings: {
        workerName: '',
        defaultMiner: 'updated',
        coinStrategy: 'normal',
        proxy: '',
      },
      appearance: {
        theme: 'light',
      },
      pools: {
        ethash: '',
        etchash: '',
        kawpow: '',
        autolykos2: '',
        randomx: '',
      },
    };

    jest.spyOn(settings, 'getAppSettings').mockReturnValue(Promise.resolve(defaultAppSettings));

    // Act.
    const { result } = renderHook(() => useProfile());
    settings.watchers$.settings.next(updatedSettings);

    // Assert.
    expect(result.current).toBe('updated');
  });
});
