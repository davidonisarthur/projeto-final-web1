import { useEffect, useState } from 'react';
import { readPreferences, savePreferences } from '../lib/storage.js';

function getStorage() {
  try { return window.localStorage; } catch { return undefined; }
}
export function usePreferences() {
  const [preferences, setPreferences] = useState(() => readPreferences(getStorage()));
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    setSaved(savePreferences(getStorage(), preferences));
  }, [preferences]);
  function select(key, value) {
    setPreferences(previous => previous[key] === value ? previous : { ...previous, [key]: value });
  }
  return { ...preferences, saved, select };
}
