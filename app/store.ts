"use client";
import { proxy, ref, subscribe } from "valtio";
import { Message } from "ai";

export type Response = {
  id: string;
  messages: Message[];
  modelId: string;
  serviceName: string;
  error?: string;
};

export type Model = {
  id: string;
  name: string;
  visible: boolean;
};

export type Service = {
  id: string;
  name: string;
  models: Model[];
  providerId: string;
  baseURL: string;
  apiKey: string;
};

export type Store = {
  responses: Response[];
  prompt: { blocks: string[] };
  selected: { modelId?: string; service?: Service };
  services: Service[];
};

const defaultStore: Store = {
  prompt: { blocks: [""] },
  responses: [],
  selected: {},
  services: [],
};

export let store = proxy<Store>(defaultStore);

export function submitPrompt() {
  if (!store.selected.service || !store.selected.modelId) {
    // TODO: show error
    return;
  }
  store.responses.unshift({
    id: crypto.randomUUID(),
    // message controlled by useChat treat as ref in store
    messages: ref([
      {
        id: crypto.randomUUID(),
        role: "user",
        content: store.prompt.blocks.join("\n"),
      },
    ]),
    modelId: store.selected.modelId,
    serviceName: store.selected.service.name,
  });
}

export function updateService(id: string, values: Partial<Service>) {
  const service = store.services.find((s) => s.id === id);
  if (service) {
    Object.assign(service, values);
  }
}

subscribe(store, (s) => {
  localStorage.setItem("store", JSON.stringify(store));
});

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export function loadFromLocalStorage() {
  const initStore = JSON.parse(localStorage.getItem("store") as string);
  if (initStore) {
    initStore.responses = initStore.responses.map((res: any) => {
      res.messages = ref(res.messages);
      return res;
    });
    Object.assign(store, initStore);
  }
}
