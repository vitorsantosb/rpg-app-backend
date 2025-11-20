import { RoleManager } from "@configs/roles/roles";
import { GetDatabase } from "@database/database";

export async function UpdateUserRoleSlugs() {
  const { collections } = await GetDatabase();

  const cursor = collections.users.find({ _roleSlugs: { $exists: false } });

  while (await cursor.hasNext()) {
    const user = await cursor.next();
    if (!user) continue;

    const roleSlugs = RoleManager.getRoleNamesFromBitfield(user._roles);
    await collections.users.updateOne(
      { _id: user._id },
      { $set: { _roleSlugs: roleSlugs } }
    );
  }

  console.log('Migration finished');
  process.exit(0);
}