export {};

declare global {
  type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

  type AllowUndefined<T, K extends keyof T> = Omit<T, K> & {
    [P in K]: T[P] | undefined;
  };
}
