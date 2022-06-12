import { render } from "solid-js/web";
import { For, mergeProps, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

function CustomInput1(props: {
  value: string;
  handleUpdate: (v: string) => void;
}) {
  const mp = mergeProps({ value: "" }, props);
  console.log("I Born", props.value);
  const transformDown = (value: string) => {
    console.log("I transform up", props.value);
    return value.toLocaleUpperCase();
  };
  const transformUp = (value: string) => {
    console.log("I transform down", props.value);
    return value.toLocaleLowerCase();
  };

  return (
    <>
      <span>{new Date().toTimeString()}</span>
      <input
        value={transformDown(mp.value)}
        onInput={(e) => mp.handleUpdate?.(transformUp((e.target as any).value))}
      />
    </>
  );
}

function App() {
  let id = 0;
  const [store, setStore] = createStore([
    { value: "123", id: id++ },
    { value: "321", id: id++ },
  ]);
  createEffect(() => {
    console.log(store.map((x) => x.value).join(","));
  });

  function moveDown(idx: number) {
    if (idx >= store.length - 1 || idx < 0) return;
    const newStore = [
      ...store.slice(0, idx),
      store[idx + 1],
      store[idx],
      ...store.slice(idx + 2),
    ];
    setStore(newStore);
  }
  function addRow() {
    setStore([...store, { value: "999", id: id++ }]);
  }

  function handleUpdate(newV: string, id: number) {
    setStore((m) => m.id === id, "value", newV);
    const modelIdx = store.findIndex((x) => x.id === id);
    if (modelIdx === store.length - 1) {
      addRow();
    }
  }

  return (
    <>
      <For each={store}>
        {(model, i) => (
          <div>
            <CustomInput1
              value={model.value}
              handleUpdate={(newV) => handleUpdate(newV, model.id)}
            />
            <input type="button" value="Up" onClick={() => moveDown(i() - 1)} />
            <input type="button" value="Down" onClick={() => moveDown(i())} />

            <input
              type="button"
              value="Del"
              onClick={() =>
                setStore([...store.filter((x) => x.id !== model.id)])
              }
            />
          </div>
        )}
      </For>
      <input type="button" value="add row" onClick={addRow} />
    </>
  );
}

export default App;