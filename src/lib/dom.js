// Tiny element builder: el('div', { class: 'x', onclick: fn }, child, 'text').
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k === 'style') node.style.cssText = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  node.append(...children.flat().filter((c) => c != null));
  return node;
}
