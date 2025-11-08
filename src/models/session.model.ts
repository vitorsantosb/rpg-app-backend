import mongoose, { Schema, Document, Model } from 'mongoose';
import { GetWriteConnection, GetReadConnection } from '@database/database';

// Interface do documento Session
export interface ISession extends Document {
  name: string;
  description?: string;
  masterId: mongoose.Types.ObjectId; // ID do mestre/criador da sessão
  status: 'active' | 'paused' | 'ended' | 'preparing';
  settings: {
    fogOfWar?: boolean;
    allowPlayerMovement?: boolean;
    allowPlayerRolls?: boolean;
    maxPlayers?: number;
    [key: string]: any; // Permite configurações customizadas
  };
  members: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'master' | 'co_master' | 'player' | 'listener';
    joinedAt: Date;
    permissions?: Record<string, any>;
  }>;
  campaignId?: mongoose.Types.ObjectId; // Opcional: link para campanha
  metadata?: Record<string, any>; // Dados extras flexíveis
  createdAt: Date;
  updatedAt: Date;
}

// Schema do Mongoose
const SessionSchema = new Schema<ISession>(
  {
    name: {
      type: String,
      required: [true, 'Session name is required'],
      trim: true,
      maxlength: [200, 'Session name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    masterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Master ID is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'ended', 'preparing'],
      default: 'preparing',
      index: true,
    },
    settings: {
      fogOfWar: {
        type: Boolean,
        default: false,
      },
      allowPlayerMovement: {
        type: Boolean,
        default: true,
      },
      allowPlayerRolls: {
        type: Boolean,
        default: true,
      },
      maxPlayers: {
        type: Number,
        default: 10,
        min: 1,
        max: 50,
      },
    },
    members: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      role: {
        type: String,
        enum: ['master', 'co_master', 'player', 'listener'],
        required: true,
        default: 'player',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      permissions: {
        type: Schema.Types.Mixed,
        default: {},
      },
    }],
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'sessions',
  }
);

// Índices para performance
SessionSchema.index({ masterId: 1, status: 1 });
SessionSchema.index({ 'members.userId': 1 });
SessionSchema.index({ campaignId: 1 });
SessionSchema.index({ createdAt: -1 });
SessionSchema.index({ status: 1, createdAt: -1 });

// Índice composto para buscar sessões ativas de um mestre
SessionSchema.index({ masterId: 1, status: 1, createdAt: -1 });

// Métodos do Schema (opcional)
SessionSchema.methods.addMember = function(userId: mongoose.Types.ObjectId, role: string = 'player') {
  const existingMember = this.members.find((m: any) => m.userId.toString() === userId.toString());
  if (existingMember) {
    return false; // Já é membro
  }
  this.members.push({
    userId,
    role,
    joinedAt: new Date(),
  });
  return true;
};

SessionSchema.methods.removeMember = function(userId: mongoose.Types.ObjectId) {
  this.members = this.members.filter((m: any) => m.userId.toString() !== userId.toString());
};

SessionSchema.methods.isMember = function(userId: mongoose.Types.ObjectId): boolean {
  return this.members.some((m: any) => m.userId.toString() === userId.toString());
};

SessionSchema.methods.getMemberRole = function(userId: mongoose.Types.ObjectId): string | null {
  const member = this.members.find((m: any) => m.userId.toString() === userId.toString());
  return member ? member.role : null;
};

// Função para obter o modelo (usa a conexão de escrita)
export async function GetSessionModel(): Promise<Model<ISession>> {
  const connection = await GetWriteConnection();
  return connection.model<ISession>('Session', SessionSchema);
}

// Função para obter o modelo para leitura
export async function GetSessionReadModel(): Promise<Model<ISession>> {
  const connection = await GetReadConnection();
  return connection.model<ISession>('Session', SessionSchema);
}

