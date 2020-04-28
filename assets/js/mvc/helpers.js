export function traverseDOM(node, f) {
  f(node);
  [...node.children].forEach((child) => traverseDOM(child, f));
}

export function replaceNode(node, input) {
  let inputs;
  if (input instanceof Array) {
    inputs = input
  }
  else if (input instanceof HTMLCollection) {
    inputs = [...input]
  }
  else if (input instanceof HTMLElement || input instanceof DocumentFragment) {
    inputs = [input]
  }
  else
  {
    throw new Error("wrong type of input passed")
  }

  inputs.forEach((input_node) => (
    node.parentElement.insertBefore(input_node, node))
  )
  node.remove();
}

export function toggleBinaryClass(node, selection, falseClass, trueClass) {
  if(selection) {
    node.classList.remove(falseClass);
    node.classList.add(trueClass);
  } else { 
    node.classList.remove(trueClass);
    node.classList.add(falseClass);
  }
}