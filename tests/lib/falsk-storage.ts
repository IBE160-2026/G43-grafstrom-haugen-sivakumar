/** `Storage` i minnet som teller skrivinger og kan kaste. */
export type FalskStorage = Storage & {
  data: Map<string, string>;
  skrivinger: [string, string][];
  kastVedLes: boolean;
  kastVedSkriv: boolean;
  kastVedSlett: boolean;
};

export function falskStorage(start: Record<string, string> = {}): FalskStorage {
  const data = new Map(Object.entries(start));
  const storage: FalskStorage = {
    data,
    skrivinger: [],
    kastVedLes: false,
    kastVedSkriv: false,
    kastVedSlett: false,
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    key: (i) => [...data.keys()][i] ?? null,
    getItem(nøkkel) {
      if (storage.kastVedLes) throw new Error("SecurityError");
      return data.get(nøkkel) ?? null;
    },
    setItem(nøkkel, verdi) {
      if (storage.kastVedSkriv) throw new Error("QuotaExceededError");
      storage.skrivinger.push([nøkkel, verdi]);
      data.set(nøkkel, verdi);
    },
    removeItem(nøkkel) {
      if (storage.kastVedSlett) throw new Error("SecurityError");
      data.delete(nøkkel);
    },
  };
  return storage;
}
