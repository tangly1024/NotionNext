import type { AttributifyAttributes } from '@unocss/preset-attributify'

// declare module 'solid-js' {
//   namespace JSX {
//     interface HTMLAttributes<T> extends AttributifyAttributes {}
//   }
// }

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes { }
  }
  namespace JSX {
    interface HTMLAttributes<T> extends AttributifyAttributes {}
  }
}