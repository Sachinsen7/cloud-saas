export interface Video {
  id: string;
  title: string;
  description: string;
  public_id: string;
  createdAt: Date;
  duration: number;
  originalSize: number;
  compressedSize: number;
}
