import { useState } from 'react';
import { watchers$ } from '../services/AppSettingsService';
import { useLoadData } from './loadData';
import { useObservable } from './observable';

export function useProfile() {
  const [profile, setProfile] = useState('');

  useLoadData(async ({ getAppSettings }) => {
    const appSettings = await getAppSettings();
    setProfile(appSettings.settings.defaultMiner);
  });

  useObservable(watchers$.settings, (s) => setProfile(s.settings.defaultMiner));
  return profile;
}
