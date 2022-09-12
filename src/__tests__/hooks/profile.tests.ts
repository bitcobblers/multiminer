import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react-test-renderer';
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
    const { result } = renderHook(() => useProfile());

    // Assert.
    await waitFor(() => {
      expect(result.current).toBe('default');
    });
  });

  it('Updates profile when configuration changes.', async () => {
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
        etchash: '',
        kawpow: '',
        autolykos2: '',
        randomx: '',
      },
    };

    jest.spyOn(settings, 'getAppSettings').mockReturnValue(Promise.resolve(defaultAppSettings));

    // Act.
    const { result } = renderHook(() => useProfile());

    act(() => settings.watchers$.settings.next(updatedSettings));

    // Assert.
    await waitFor(() => expect(result.current).toBe('updated'));
  });
});
