export function findChildWithClass(node, className) {
    const children = [...node.children]
    return children.find((c) => c.classList.contains(className))
}