// Every way to choose k items from a list, order ignored.
export const combos = (items, k) => (k === 0 ? [[]] : items.flatMap((x, i) => combos(items.slice(i + 1), k - 1).map((c) => [x, ...c])));
