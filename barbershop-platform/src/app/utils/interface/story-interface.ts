export interface Story {
  id: string;
  type: 'image' | 'video';
  url?: string;
  path?: string;
  useBy: string;
}