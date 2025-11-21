import {
  SuccessLogMessage,
  WarningLogMessage,
  DebugLogMessage
} from '@configs/logs/logMessages';

export const PermissionBits = {
  // === SISTEMA / GLOBAL ===
  MANAGE_SYSTEM_SETTINGS       : 1n << 28n, // Alterar configurações globais
  MANAGE_USERS                 : 1n << 29n, // Criar / editar / banir usuários
  MANAGE_ROLES                 : 1n << 30n, // Criar e gerenciar roles customizadas
  VIEW_AUDIT_LOGS              : 1n << 31n, // Ver logs do sistema
  BAN_USERS                    : 1n << 32n, // Banir / suspender usuários
  MUTE_USERS                   : 1n << 33n, // Silenciar usuários temporariamente
  MANAGE_CONTENT               : 1n << 34n, // Moderação de postagens / assets públicos
  POST_CONTENT                 : 1n << 35n, // Criar conteúdo público
  COMMENT_CONTENT              : 1n << 36n, // Comentar em conteúdos públicos
  VIEW_CONTENT                 : 1n << 37n, // Visualizar conteúdo público
  REPORT_CONTENT               : 1n << 38n, // Reportar conteúdo inadequado
  GET_USER_DATA                : 1n << 39n, // Recuperar os dados de usuários.

  // === GAME MASTER ===
  CREATE_CAMPAIGN              : 1n << 0n,  // Criar campanha
  DELETE_CAMPAIGN              : 1n << 1n,  // Deletar campanha
  ACCESS_SECRET_FOLDERS        : 1n << 2n,  // Acesso a pastas secretas
  MANAGE_ASSETS                : 1n << 3n,  // Ativar/Desativar/Adicionar/remover assets
  MANAGE_SHEETS                : 1n << 4n,  // Criar/deletar/editar/ocultar fichas
  HIDE_MAP_ELEMENTS            : 1n << 5n,  // Ocultar elementos no mapa
  MANAGE_MAP_OBJECTS           : 1n << 6n,  // Gerenciar objetos no mapa
  USE_SOUNDBOARD               : 1n << 7n,  // Usar soundboard (efeitos/músicas)
  CREATE_NOTES                 : 1n << 8n,  // Criar anotações
  CONFIGURE_GAME_MASTER_SHIELD_SCREEN: 1n << 9n,  // Configurar visualização do escudo do mestre
  PRIVATE_CHAT_WITH_PLAYER     : 1n << 10n, // Chat pessoal com o player
  MANAGE_RULEBOOKS             : 1n << 11n, // Upload de livros de regras
  SHARE_RULEBOOKS              : 1n << 12n, // Disponibilizar livros para jogadores

  // === CO-MESTRE ===
  ASSIST_MANAGE_ASSETS         : 1n << 13n,
  ASSIST_MANAGE_SHEETS         : 1n << 14n,
  ASSIST_HIDE_MAP_ELEMENTS     : 1n << 15n,
  ASSIST_MANAGE_MAP_OBJECTS    : 1n << 16n,
  ASSIST_SOUNDBOARD            : 1n << 17n,
  ASSIST_NOTES                 : 1n << 18n,
  ASSIST_CONFIGURE_DM_SCREEN   : 1n << 19n,
  ASSIST_CHAT_WITH_PLAYER      : 1n << 20n,

  // === PLAYER ===
  CREATE_SHEET                 : 1n << 21n,
  EDIT_SHEET                   : 1n << 22n,
  PLAYER_NOTES                 : 1n << 23n,
  PLAYER_CHAT_GENERAL          : 1n << 24n,
  ACCESS_SHARED_RULEBOOKS      : 1n << 25n,

  // === LISTENER ===
  VIEW_TABLE                   : 1n << 26n,
  VIEW_CHAT                    : 1n << 27n,
} as const;

export type PermissionKey = keyof typeof PermissionBits;
export type PermissionValue = typeof PermissionBits[PermissionKey];

export const PermissionNames: Record<string, string> = {
  [PermissionBits.MANAGE_SYSTEM_SETTINGS.toString()]: "MANAGE_SYSTEM_SETTINGS",
  [PermissionBits.MANAGE_USERS.toString()]: "MANAGE_USERS",
  [PermissionBits.MANAGE_ROLES.toString()]: "MANAGE_ROLES",
  [PermissionBits.VIEW_AUDIT_LOGS.toString()]: "VIEW_AUDIT_LOGS",
  [PermissionBits.BAN_USERS.toString()]: "BAN_USERS",
  [PermissionBits.MUTE_USERS.toString()]: "MUTE_USERS",
  [PermissionBits.MANAGE_CONTENT.toString()]: "MANAGE_CONTENT",
  [PermissionBits.POST_CONTENT.toString()]: "POST_CONTENT",
  [PermissionBits.COMMENT_CONTENT.toString()]: "COMMENT_CONTENT",
  [PermissionBits.VIEW_CONTENT.toString()]: "VIEW_CONTENT",
  [PermissionBits.REPORT_CONTENT.toString()]: "REPORT_CONTENT",
  //RPG Permissions
  [PermissionBits.CREATE_CAMPAIGN.toString()]:            "CREATE_CAMPAIGN",
  [PermissionBits.DELETE_CAMPAIGN.toString()]:            "DELETE_CAMPAIGN",
  [PermissionBits.ACCESS_SECRET_FOLDERS.toString()]:      "ACCESS_SECRET_FOLDERS",
  [PermissionBits.MANAGE_ASSETS.toString()]:              "MANAGE_ASSETS",
  [PermissionBits.MANAGE_SHEETS.toString()]:              "MANAGE_SHEETS",
  [PermissionBits.HIDE_MAP_ELEMENTS.toString()]:          "HIDE_MAP_ELEMENTS",
  [PermissionBits.MANAGE_MAP_OBJECTS.toString()]:         "MANAGE_MAP_OBJECTS",
  [PermissionBits.USE_SOUNDBOARD.toString()]:             "USE_SOUNDBOARD",
  [PermissionBits.CREATE_NOTES.toString()]:               "CREATE_NOTES",
  [PermissionBits.CONFIGURE_GAME_MASTER_SHIELD_SCREEN.toString()]:        "CONFIGURE_GAME_MASTER_SHIELD_SCREEN",
  [PermissionBits.PRIVATE_CHAT_WITH_PLAYER.toString()]:   "PRIVATE_CHAT_WITH_PLAYER",
  [PermissionBits.MANAGE_RULEBOOKS.toString()]:           "MANAGE_RULEBOOKS",
  [PermissionBits.SHARE_RULEBOOKS.toString()]:            "SHARE_RULEBOOKS",

  [PermissionBits.ASSIST_MANAGE_ASSETS.toString()]:       "ASSIST_MANAGE_ASSETS",
  [PermissionBits.ASSIST_MANAGE_SHEETS.toString()]:       "ASSIST_MANAGE_SHEETS",
  [PermissionBits.ASSIST_HIDE_MAP_ELEMENTS.toString()]:   "ASSIST_HIDE_MAP_ELEMENTS",
  [PermissionBits.ASSIST_MANAGE_MAP_OBJECTS.toString()]:  "ASSIST_MANAGE_MAP_OBJECTS",
  [PermissionBits.ASSIST_SOUNDBOARD.toString()]:          "ASSIST_SOUNDBOARD",
  [PermissionBits.ASSIST_NOTES.toString()]:               "ASSIST_NOTES",
  [PermissionBits.ASSIST_CONFIGURE_DM_SCREEN.toString()]: "ASSIST_CONFIGURE_DM_SCREEN",
  [PermissionBits.ASSIST_CHAT_WITH_PLAYER.toString()]:    "ASSIST_CHAT_WITH_PLAYER",

  [PermissionBits.CREATE_SHEET.toString()]:               "CREATE_SHEET",
  [PermissionBits.EDIT_SHEET.toString()]:                 "EDIT_SHEET",
  [PermissionBits.PLAYER_NOTES.toString()]:               "PLAYER_NOTES",
  [PermissionBits.PLAYER_CHAT_GENERAL.toString()]:        "PLAYER_CHAT_GENERAL",
  [PermissionBits.ACCESS_SHARED_RULEBOOKS.toString()]:    "ACCESS_SHARED_RULEBOOKS",

  [PermissionBits.VIEW_TABLE.toString()]:                 "VIEW_TABLE",
  [PermissionBits.VIEW_CHAT.toString()]:                  "VIEW_CHAT",
};

/**
 * Checa se o bitfield contém a(s) permissão(ões) passada(s).
 * Se requireAll = true então exige todas; se false (padrão) aceita pelo menos 1.
 */
export function hasPermission(bitfield: bigint, perm: bigint, requireAll = true): boolean {
  if (requireAll) return (bitfield & perm) === perm;
  return (bitfield & perm) !== 0n;
}

/**
 * Adiciona uma permissão ao bitfield.
 * Faz log apenas se a permissão ainda não existia.
 */
export function addPermission(bitfield: bigint, perm: bigint): bigint {
  const alreadyHas = (bitfield & perm) === perm;
  const updated = bitfield | perm;

  if (!alreadyHas) {
    const permNames = listPermissions(perm).join(', ') || `bit ${perm}`;
    SuccessLogMessage('addPermission', `Permissão adicionada com sucesso`, { permNames });
  } else {
    DebugLogMessage('addPermission', `Permissão já existente`, { perm });
  }

  return updated;
}

/**
 * Remove uma permissão do bitfield.
 * Faz log apenas se a permissão estava presente.
 */
export function removePermission(bitfield: bigint, perm: bigint): bigint {
  const hadPermission = (bitfield & perm) === perm;
  const updated = bitfield & ~perm;

  if (hadPermission) {
    const permNames = listPermissions(perm).join(', ') || `bit ${perm}`;
    WarningLogMessage('removePermission', `Permissão removida`, { permNames });
  } else {
    DebugLogMessage('removePermission', `Permissão inexistente`, { perm });
  }

  return updated;
}

/** Retorna lista de nomes das permissões presentes no bitfield */
export function listPermissions(bitfield: bigint): string[] {
  const result: string[] = [];
  for (const key of Object.keys(PermissionNames)) {
    const k = BigInt(key);
    if ((bitfield & k) === k) result.push(PermissionNames[key]);
  }
  return result;
}

/**
 * Converte qualquer valor (number | string | bigint) para bigint
 */
export function toBigInt(value: number | string | bigint): bigint {
  return typeof value === 'bigint' ? value : BigInt(value);
}
