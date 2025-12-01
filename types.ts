export interface AlbumPhoto {
  id: string;
  url: string;
  name: string;
  date?: string;
}

export interface MusicTrack {
  url: string;
  title: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  VIEWER = 'VIEWER',
}

export type Language = 'en' | 'ko';