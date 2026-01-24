import storage from '@/utils/storage';
import { useUserStore } from '@/store/user';
import { UserRole } from '@/types/user';

export default function access() {
  const token = storage.get('token');
  const userInfo = useUserStore.getState().userInfo;

  const currentRoles: string[] = [];
  if (Array.isArray((userInfo as any)?.roles)) {
    currentRoles.push(...((userInfo as any).roles as string[]));
  }
  if (userInfo?.user_type === UserRole.USER && !currentRoles.includes('admin')) {
    currentRoles.push('admin');
  }

  return {
    canAccessRoute: (route: any) => {
      const requiredRoles: string[] = route?.meta?.roles ?? [];
      if (!requiredRoles.length) {
        return true;
      }

      if (!token) {
        return false;
      }

      if (!currentRoles.length) {
        return false;
      }

      return requiredRoles.some((role) => currentRoles.includes(role));
    },
  };
}
