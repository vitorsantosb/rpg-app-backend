import { PermissionBits } from '@configs/roles/permissions/permissionBitField';

export const RolePresets = {
  // === SISTEMA ===
  ADMINISTRATOR:
    PermissionBits.MANAGE_SYSTEM_SETTINGS |
    PermissionBits.MANAGE_USERS |
    PermissionBits.MANAGE_ROLES |
    PermissionBits.VIEW_AUDIT_LOGS |
    PermissionBits.BAN_USERS |
    PermissionBits.MUTE_USERS |
    PermissionBits.MANAGE_CONTENT |
    PermissionBits.POST_CONTENT |
    PermissionBits.COMMENT_CONTENT |
    PermissionBits.VIEW_CONTENT |
    PermissionBits.REPORT_CONTENT,

  MODERATOR:
    PermissionBits.MANAGE_CONTENT |
    PermissionBits.MUTE_USERS |
    PermissionBits.BAN_USERS |
    PermissionBits.REPORT_CONTENT |
    PermissionBits.VIEW_CONTENT |
    PermissionBits.COMMENT_CONTENT,

  USER:
    PermissionBits.CREATE_CAMPAIGN |
    PermissionBits.POST_CONTENT |
    PermissionBits.COMMENT_CONTENT |
    PermissionBits.VIEW_CONTENT |
    PermissionBits.REPORT_CONTENT,

  GAME_MASTER:
    PermissionBits.CREATE_CAMPAIGN |
    PermissionBits.DELETE_CAMPAIGN |
    PermissionBits.ACCESS_SECRET_FOLDERS |
    PermissionBits.MANAGE_ASSETS |
    PermissionBits.MANAGE_SHEETS |
    PermissionBits.HIDE_MAP_ELEMENTS |
    PermissionBits.MANAGE_MAP_OBJECTS |
    PermissionBits.USE_SOUNDBOARD |
    PermissionBits.CREATE_NOTES |
    PermissionBits.CONFIGURE_GAME_MASTER_SHIELD_SCREEN |
    PermissionBits.PRIVATE_CHAT_WITH_PLAYER |
    PermissionBits.MANAGE_RULEBOOKS |
    PermissionBits.SHARE_RULEBOOKS,

  CO_GAME_MASTER:
    PermissionBits.ASSIST_MANAGE_ASSETS |
    PermissionBits.ASSIST_MANAGE_SHEETS |
    PermissionBits.ASSIST_HIDE_MAP_ELEMENTS |
    PermissionBits.ASSIST_MANAGE_MAP_OBJECTS |
    PermissionBits.ASSIST_SOUNDBOARD |
    PermissionBits.ASSIST_NOTES |
    PermissionBits.ASSIST_CONFIGURE_DM_SCREEN |
    PermissionBits.ASSIST_CHAT_WITH_PLAYER,

  PLAYER:
    PermissionBits.CREATE_SHEET |
    PermissionBits.EDIT_SHEET |
    PermissionBits.PLAYER_NOTES |
    PermissionBits.PLAYER_CHAT_GENERAL |
    PermissionBits.ACCESS_SHARED_RULEBOOKS,

  LISTENER:
    PermissionBits.VIEW_TABLE |
    PermissionBits.VIEW_CHAT,
} as const;
