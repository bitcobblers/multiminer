import { useState, useEffect } from 'react';
import { getAppSettings, watchers$ } from '../services/AppSettingsService';
import { useLoadData } from './loadData';

export function useProfile() {
  const [profile, setProfile] = useState('');

  useLoadData(async () => {
    const appSettings = await getAppSettings();
    setProfile(appSettings.settings.defaultMiner);
  });

  useEffect(() => {
    const configSubscription = watchers$.settings.subscribe((appSettings) => {
      setProfile(appSettings.settings.defaultMiner);
    });

    return () => {
      configSubscription.unsubscribe();
    };
  }, []);

  return profile;
}
