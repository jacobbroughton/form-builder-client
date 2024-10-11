export function debounce(func: () => void, ms: number) {
  console.log("debouncing");
  function yeet() {
    const timer = setTimeout(() => {
      console.log("settimeout");
      func.apply(this, []);
    }, ms);

    console.log(timer);
  }

  yeet()
}
