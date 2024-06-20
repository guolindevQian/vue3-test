/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
  }
  
// type Filter = {
//     format<T>(str:T):string
// }

// declare module 'vue'{
//     export interface ComponentCustomProperties{
//         $filters:Filter
//     }
// }