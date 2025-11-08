import { PermissionBits, PermissionNames, addPermission, removePermission, hasPermission, listPermissions } from './permissions/permissionBitField';
import { InfoLogMessage, WarningLogMessage, SuccessLogMessage } from '@configs/logs/logMessages';
import { RolePresets } from '@configs/roles/permissions/rolesModel';

export class RoleManager {
  /** Presets de roles padrão do sistema */
  static presets = RolePresets;

  /** Retorna o valor (bitfield) de uma role */
  static getRoleValue(role: keyof typeof RolePresets): bigint {
    const value = this.presets[role];
    InfoLogMessage('RoleManager.getRoleValue', `Obtido valor da role '${role}'`, { value: value.toString() });
    return value;
  }

  /** Verifica se o bitfield possui uma permissão específica */
  static hasPermission(roleBitfield: bigint, perm: bigint, requireAll = true): boolean {
    const result = hasPermission(roleBitfield, perm, requireAll);
    InfoLogMessage('RoleManager.hasPermission', `Verificação de permissão`, {
      bitfield: roleBitfield.toString(),
      permission: PermissionNames[perm.toString()],
      result
    });
    return result;
  }

  /** Adiciona uma permissão a um bitfield existente e retorna o novo valor */
  static addPermission(roleBitfield: bigint, perm: bigint): bigint {
    const updated = addPermission(roleBitfield, perm);
    SuccessLogMessage('RoleManager.addPermission', `Permissão adicionada`, {
      before: roleBitfield.toString(),
      after: updated.toString(),
      permission: PermissionNames[perm.toString()]
    });
    return updated;
  }

  /** Remove uma permissão de um bitfield existente e retorna o novo valor */
  static removePermission(roleBitfield: bigint, perm: bigint): bigint {
    const updated = removePermission(roleBitfield, perm);
    WarningLogMessage('RoleManager.removePermission', `Permissão removida`, {
      before: roleBitfield.toString(),
      after: updated.toString(),
      permission: PermissionNames[perm.toString()]
    });
    return updated;
  }

  /** Lista todas as permissões associadas a um bitfield */
  static listPermissions(roleBitfield: bigint): string[] {
    const permissions = listPermissions(roleBitfield);
    InfoLogMessage('RoleManager.listPermissions', `Permissões listadas`, { permissions });
    return permissions;
  }

  /** Clona um bitfield de role existente (útil para criar templates ou presets customizados) */
  static cloneRole(baseRole: keyof typeof RolePresets, newRoleName: string): { name: string; bitfield: bigint } {
    const baseValue = this.getRoleValue(baseRole);
    InfoLogMessage('RoleManager.cloneRole', `Clonando role '${baseRole}' para '${newRoleName}'`, {
      bitfield: baseValue.toString()
    });
    return { name: newRoleName, bitfield: baseValue };
  }
}
