import { PermissionBits, PermissionNames, addPermission, removePermission, hasPermission, listPermissions } from './permissions/permissionBitField';
import { InfoLogMessage, WarningLogMessage, SuccessLogMessage } from '@configs/logs/logMessages';
import { RolePresets } from '@configs/roles/permissions/rolesModel';

export type RoleSlug = keyof typeof RolePresets;

export class RoleManager {
  /** Presets de roles padrão do sistema */
  static presets = RolePresets;

  /** Retorna o valor (bitfield) de uma role */
  static getRoleValue(role: RoleSlug): bigint {
    const value = this.presets[role];
    InfoLogMessage('RoleManager.getRoleValue', `Obtido valor da role '${role}'`, { value: value.toString() });
    return value;
  }

  /** Retorna o bitfield resultante da combinação de várias roles */
  static getRolesBitfield(roles: RoleSlug[]): bigint {
    const bitfield = roles.reduce<bigint>((acc, role) => {
      const value = this.getRoleValue(role);
      return acc | value;
    }, 0n);

    InfoLogMessage('RoleManager.getRolesBitfield', 'Bitfield calculado a partir das roles fornecidas', {
      roles,
      bitfield: bitfield.toString(),
    });

    return bitfield;
  }

  /** Retorna os nomes das roles cujo bitfield corresponde exatamente ao valor informado */
  static getRoleNamesFromBitfield(roleBitfield: bigint | string): string[] {
    const bitfield = typeof roleBitfield === 'string' ? BigInt(roleBitfield) : roleBitfield;
    const roles: string[] = [];

    for (const [roleName, presetValue] of Object.entries(this.presets)) {
      const presetBitfield = typeof presetValue === 'bigint' ? presetValue : BigInt(presetValue);

      if (bitfield === presetBitfield) {
        roles.push(roleName);
      }
    }

    InfoLogMessage('RoleManager.getRoleNamesFromBitfield', 'Roles obtidas a partir do bitfield', {
      bitfield: bitfield.toString(),
      roles,
    });

    return roles;
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
