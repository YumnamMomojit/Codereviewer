
export const initialCodeSample = `function factorial(n) {
  if (n = 0) { // Bug: should be ===
    return 1;
  }
  let result = 1;
  for (var i = 1; i <= n; i++) {
    result = result * i;
  }
  return result;
}

// Inefficient Fibonacci
function fib(num) {
  if (num <= 1) return 1;
  return fib(num - 1) + fib(num - 2);
}

const data = [1, 2, 3];
data.forEach(item => {
    // Some side effect
    console.log("Processing item: " + item);
});
`;
