import { ref, type Ref } from "vue";

export function useSettings<Type>(props: any) {
  const settings = ref({}) as Ref<Type>;

  Object.keys(props).forEach((key) => {
    settings.value[key] = props[key];
  });

  const setSetting = (key, value) => {
    settings.value[key] = value;
  };

  return {
    settings,
    setSetting,
  };
}
