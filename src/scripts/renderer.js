import tag from 'html5-tag';

export const renderer = (node, treeOptions) => {
  const { type, path, name, state } = node;
  console.log(node)
  const depthClass = `depth--${state.depth}`
  const isDir = type === 'directory'
  if (isDir) {
    return tag('div', { class: `dir ${depthClass}` }, name)
  } else {
    const currentPath = `./docs/${path.split('/').pop()}`
    return tag('a', { href: currentPath, download: true, class: `link ${depthClass}` }, name)
  }
 
  
}