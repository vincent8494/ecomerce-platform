// Type definitions for parse-json

declare module 'parse-json' {
  function parseJson<T = unknown>(
    input: string,
    reviver?: (key: string, value: any) => any,
    filename?: string
  ): T;

  export = parseJson;
}
