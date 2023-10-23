import { lazy } from 'react';

export default function lazyLoad(path, namedExport) {
     return lazy(() => {
          const promise = import(path /* @vite-ignore */);
          if (namedExport) {
               return promise.then(module => ({ default: module[namedExport] }));
          } else {
               return promise;
          }
     })
}