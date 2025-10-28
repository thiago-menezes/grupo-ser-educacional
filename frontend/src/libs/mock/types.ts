export interface ServerOptions {
  port: number;
  specPath: string;
  host?: string;
}

export interface MockServerOptions extends ServerOptions {
  cors?: boolean;
}

export interface DocsServerOptions extends ServerOptions {
  title?: string;
  theme?: 'light' | 'dark' | 'auto';
}
