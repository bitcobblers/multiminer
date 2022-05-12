import { useState, useEffect } from 'react';
import { getAppSettings, watchers$ } from '../services/AppSettingsService';

export function useProfile() {
  const [profile, setProfile] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const appSettings = await getAppSettings();
      setProfile(appSettings.settings.defaultMiner);
    };

    const configSubscription = watchers$.settings.subscribe((appSettings) => {
      setProfile(appSettings.settings.defaultMiner);
    });

    loadProfile();
    return () => {
      configSubscription.unsubscribe();
    };
  }, []);

  return profile;
}
