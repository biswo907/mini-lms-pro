import { useEffect, useState } from 'react';
import { NotificationService } from '../service/notification/NotificationService';

export const useNotifications = () => {
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean | null>(null);

  const checkAndRequestPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    setIsPermissionGranted(granted);
    
    if (granted) {
      await NotificationService.scheduleInactivityReminder();
    }
    
    return granted;
  };

  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  return {
    isPermissionGranted,
    requestPermissions: checkAndRequestPermissions,
  };
};
