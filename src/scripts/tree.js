import InfiniteTree from 'infinite-tree';

import 'infinite-tree/dist/infinite-tree.css';

import data from '../JSONTree';

import {renderer} from './renderer';

import './index.styl'

export function getTree() {
  const tree = new InfiniteTree({
    el: document.querySelector('#documents-tree'),
    data: data,
    autoOpen: true,
    rowRenderer: renderer,
    shouldLoadNodes: function(parentNode) {
    if (!parentNode.hasChildren() && parentNode.loadOnDemand) {
      return true;
    }
      return false;
    },
  
  });
}

