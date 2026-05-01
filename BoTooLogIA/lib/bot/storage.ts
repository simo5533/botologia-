/**
 * Persistance du bot : conversation et préférences (localStorage).
 */

const KEY_MESSAGES = "botoologia_bot_messages";
const KEY_PREFS = "botoologia_bot_prefs";
const MAX_MESSAGES = 100;

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  link?: { href: string; label?: string };
}

export interface BotPrefs {
  voiceLang: string;
  voiceRate: number;
  voiceVolume: number;
  voiceName: string | null;
  ttsEnabled: boolean;
}

const DEFAULT_PREFS: BotPrefs = {
  voiceLang: "fr-FR",
  voiceRate: 0.92,
  voiceVolume: 1,
  voiceName: null,
  ttsEnabled: true,
};

export function loadMessages(): StoredMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY_MESSAGES);
    if (!raw) return [];
    const arr = JSON.parse(raw) as StoredMessage[];
    return Array.isArray(arr) ? arr.slice(-MAX_MESSAGES) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: StoredMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    const toSave = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(KEY_MESSAGES, JSON.stringify(toSave));
  } catch {
    // quota or disabled
  }
}

export function clearMessages(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY_MESSAGES);
  } catch {}
}

export function loadPrefs(): BotPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(KEY_PREFS);
    if (!raw) return DEFAULT_PREFS;
    const p = JSON.parse(raw) as Partial<BotPrefs>;
    return { ...DEFAULT_PREFS, ...p };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: Partial<BotPrefs>): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadPrefs();
    const next = { ...current, ...prefs };
    localStorage.setItem(KEY_PREFS, JSON.stringify(next));
  } catch {}
}
