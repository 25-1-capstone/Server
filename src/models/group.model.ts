export interface BodyToGroup {
  name: string;
  description: string | null;
}

export interface GroupResponse {
  id: string;
  name: string;
  description: string | null;
  hostId: string;
}

export interface GroupRequest {
  name: string;
  description: string | null;
}

export interface GroupUserResponse {
  id: string;
  group: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
}

export interface GroupListResponse {
  groups: {
    id: string;
    name: string;
    memberCount: number;
  }[];
}
