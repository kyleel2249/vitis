import { getCurrentUser } from './auth';

export async function getAdminUser() {
  const user = await getCurrentUser();
  if (!user || !['admin', 'super_admin'].includes(user.role)) return null;
  return user;
}