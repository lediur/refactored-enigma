declare function CollectGarbage(): void;
declare namespace console {
  function log(str: string, ...more: any[]): void;
}

declare var callbacks: any;
