export const eventBusService = createEventEmitter();

function createEventEmitter() {
  const listenerMap = {};

  return {
    on(evName, listener) {
      listenerMap[evName] = listenerMap[evName]
        ? [...listenerMap[evName], listener]
        : [listener];
      return () => {
        listenerMap[evName] = listenerMap[evName].filter(
          (func) => func !== listener
        );
      };
    },
    emit(evName, data) {
      if (!listenerMap[evName]) return;
      listenerMap[evName].forEach((listener) => listener(data));
    },
  };
}
