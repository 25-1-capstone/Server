export interface FocusTargetResponse {
  id: string;
  target: string;
  userId: string;
  status: number;
}

export interface FocusTargetState {
  targetId: string;
  userId: string;
  timestamp: Date;
  isInitial: Date;
}

export interface FocusTargetListResponse {
  targets: {
    id: string;
    target: string;
    userId: string;
    status: number;
  }[];
}
