export default function QueryProcessor(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (q.includes("andrew id")) return "malali";

  // Questions like "Which of the following ... : a, b, c?" list their candidates after the colon.
  const items = (query.split(":")[1] ?? "")
    .replace(/\?\s*$/, "")
    .split(",")
    .map((item) => item.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean)
  const numbers = items.map(Number).filter((n) => !Number.isNaN(n))

  if (q.includes("anagram")) {
    const target = query.match(/anagram of "?([a-z]+)"?/i)?.[1]
    if (target) return items.filter((word) => isAnagram(word, target)).join(", ")
  }

  if (q.includes("largest") && numbers.length) return String(Math.max(...numbers));
  if (q.includes("smallest") && numbers.length) return String(Math.min(...numbers));

  if (q.includes("square and a cube") || q.includes("square and cube")) {
    // Both a square and a cube means a perfect sixth power.
    return numbers.filter((n) => n > 0 && Math.round(n ** (1 / 6)) ** 6 === n).join(",");
  }

  if (q.includes("prime") && numbers.length) return numbers.filter(isPrime).join(",");

  const factorial = q.match(/(\d+)\s*factorial|factorial of (\d+)/);
  if (factorial) return String(factorialOf(Number(factorial[1] ?? factorial[2])));

  const fib = q.match(/(\d+)(?:st|nd|rd|th) number in the fibonacci/);
  if (fib) return String(fibonacci(Number(fib[1])));

  const math = evaluate(q);
  if (math !== undefined) return String(math);

  const scrabble = q.match(/scrabble score of "?([a-z]+)"?/);
  if (scrabble) return String(scrabbleScore(scrabble[1]));

  if (q.includes("banana")) return "yellow";
  if (q.includes("eiffel")) return "Paris";
  if (q.includes("prime minister")) return "Keir Starmer";
  if (q.includes("currency") && q.includes("spain")) return "Peseta";
  if (q.includes("james bond") && q.includes("dr no")) return "Sean Connery";

  if (q.includes("name")) return "m";

  if (q.includes("age")) return "67";

  return "";
}

function isAnagram(a: string, b: string) {
  const sort = (word: string) => word.toLowerCase().split("").sort().join("")
  return sort(a) === sort(b)
}

function scrabbleScore(word: string) {
  const tiles = ["aeioulnrst", "dg", "bcmp", "fhvwy", "k", "", "", "jx", "", "qz"]
  return word.split("").reduce((score, letter) => score + tiles.findIndex((group) => group.includes(letter)) + 1, 0)
}

function isPrime(n: number) {
  if (!Number.isInteger(n) || n < 2) return false
  return Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).every((d) => n % d !== 0)
}

function factorialOf(n: number) {
  return Array.from({ length: n }, (_, i) => BigInt(i + 1)).reduce((product, i) => product * i, BigInt(1))
}

function fibonacci(n: number) {
  // 1-indexed: 1, 1, 2, 3, 5, ...
  return Array.from({ length: n - 1 }).reduce<[number, number]>(([a, b]) => [b, a + b], [1, 1])[0]
}

// Turns "what is 3 plus 4 multiplied by 5?" into an arithmetic expression.
// The regex whitelist makes sure only digits and operators ever reach Function.
function evaluate(q: string) {
  const expression = q
    .replace(/^what is\s+/, "")
    .replace(/\?\s*$/, "")
    .replace(/to the power of/g, "**")
    .replace(/multiplied by|times/g, "*")
    .replace(/divided by/g, "/")
    .replace(/plus/g, "+")
    .replace(/minus/g, "-")
  if (!/^[\d\s+\-*/.()]+$/.test(expression) || !/\d\s*(\*\*|[+\-*/])\s*-?\d/.test(expression)) return undefined
  // Integer-only expressions run on BigInt so large results (e.g. powers) print exactly, not as 6.4e+38.
  if (!/[./]/.test(expression)) {
    const exact = run(expression.replace(/\d+/g, "$&n"))
    if (typeof exact === "bigint") return exact
  }
  const result = run(expression)
  return typeof result === "number" && Number.isFinite(result) ? result : undefined
}

function run(expression: string) {
  try {
    return Function(`"use strict"; return (${expression})`)()
  } catch {
    return undefined
  }
}
