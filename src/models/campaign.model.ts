import {Document, ObjectId} from 'mongodb';

// Tipo union para autocomplete do TypeScript
export type CampaignStatus = 'active' | 'paused' | 'finished';

// Objeto constante para referência (opcional, para uso em código)
export const CampaignStatusValues = {
  ACTIVE: 'active' as const,
  PAUSED: 'paused' as const,
  FINISHED: 'finished' as const,
} as const;

export interface ICampaign {
  _id?: ObjectId;
  _name: string;
  _description?: string;
  _master_id: ObjectId;
  _players?: ObjectId[];
  _maxPlayers?: number;
  _status?: CampaignStatus;
  _created_at: Date;
  _updated_at?: Date;
  _deleted_at?: Date;
  _isDeleted?: boolean;
}

