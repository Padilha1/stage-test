export type DocumentType = "URL" | "FILE";

export type Document = {
  id: string;
  title: string;
  type: DocumentType;
  url?: string | null;
  storageKey?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
};
