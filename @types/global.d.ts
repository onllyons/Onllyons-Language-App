declare global {
  type Timeout = NodeJS.Timeout | null | number;
  type process = process & { env: { test: string } & typeof process.env };
}
