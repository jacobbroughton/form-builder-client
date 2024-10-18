export function debounce(func: () => void, ms: number) {
  function yeet() {
    const timer = setTimeout(() => {
      func.apply(this, []);
    }, ms);
  }

  yeet();
}
