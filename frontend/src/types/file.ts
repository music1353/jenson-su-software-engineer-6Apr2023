interface FileType {
  id: number;
  key: string;
  name: string;
  uri: string;
  size: number;
  mimetype: string;
  created_at: Date;
}

export type { FileType };