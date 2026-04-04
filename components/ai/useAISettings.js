'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AI_SETTINGS_KEY,
  DEFAULT_SETTINGS,
  mergeDeep,
  resolveSceneSettings
} from './aiConfig';
import { getProviderById } from './aiProviders';
import { getAssistantById } from './aiAssistants';

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useAISettings(scene) {
  const [allSettings, setAllSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AI_SETTINGS_KEY);
      const parsed = raw ? safeParse(raw) : null;
      if (parsed) {
        setAllSettings(mergeDeep(DEFAULT_SETTINGS, parsed));
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(allSettings));
    } catch {}
  }, [allSettings, loaded]);

  const resolvedSettings = useMemo(() => {
    return resolveSceneSettings(allSettings, scene);
  }, [allSettings, scene]);

  const updateSharedSettings = (patch) => {
    setAllSettings((prev) => ({
      ...prev,
      shared: {
        ...prev.shared,
        ...patch
      }
    }));
  };

  const updateSceneSettings = (sceneKey, patch) => {
    setAllSettings((prev) => ({
      ...prev,
      scenes: {
        ...prev.scenes,
        [sceneKey]: {
          ...prev.scenes?.[sceneKey],
          ...patch
        }
      }
    }));
  };

  const selectProvider = (providerId) => {
    setAllSettings((prev) => {
      const provider = getProviderById(providerId);
      const nextModel = provider?.models?.[0] || prev.shared.model;
      const nextApiUrl = provider?.baseUrl ?? prev.shared.apiUrl;

      return {
        ...prev,
        shared: {
          ...prev.shared,
          providerId,
          apiUrl: nextApiUrl,
          model: nextModel
        }
      };
    });
  };

  const selectAssistant = (sceneKey, assistantId) => {
    const assistant = getAssistantById(assistantId);
    if (!assistant) return;

    updateSceneSettings(sceneKey, {
      assistantId,
      systemPrompt: assistant.prompt
    });
  };

  const resetScenePrompt = (sceneKey) => {
    setAllSettings((prev) => {
      const assistantId = prev.scenes?.[sceneKey]?.assistantId;
      const assistant = getAssistantById(assistantId);
      if (!assistant) return prev;

      return {
        ...prev,
        scenes: {
          ...prev.scenes,
          [sceneKey]: {
            ...prev.scenes?.[sceneKey],
            systemPrompt: assistant.prompt
          }
        }
      };
    });
  };

  return {
    allSettings,
    resolvedSettings,
    updateSharedSettings,
    updateSceneSettings,
    selectProvider,
    selectAssistant,
    resetScenePrompt
  };
}

