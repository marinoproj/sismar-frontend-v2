export interface ClientDTO {
  id: number;
  code: string;
  name: string;
  dhCreate: string;
  dhDeleted: string | null;
  enableAreaNotifications: boolean;
}

export interface ProfileDTO {
  id: number;
  name: string;
  description: string;
  master: boolean;
  dhCreate: string;
}

export interface AuthSession {
  accessToken: string;
  userId: number;
  name: string;
  superUser: boolean;
  profile: ProfileDTO;
  clientId: number;
  client: ClientDTO;
  features: string[];
}
