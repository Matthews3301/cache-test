export function executeWithDelay(
  functionToExecute: () => any,
  delay: number,
) {
  setTimeout(() => {
    const result = functionToExecute();
    if (result !== undefined) console.log(result);
  }, delay);
}
