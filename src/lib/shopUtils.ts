// Utility functions for shop management

export interface OpeningHours {
  [key: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

export const isShopOpen = (openingHours: OpeningHours | null): boolean => {
  if (!openingHours) return false;

  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[now.getDay()];
  
  const todayHours = openingHours[today];
  if (!todayHours || todayHours.closed) return false;

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  return currentTime >= openTime && currentTime <= closeTime;
};

export const getTodaySchedule = (openingHours: OpeningHours | null): string => {
  if (!openingHours) return "Hours not available";

  const now = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = days[now.getDay()];
  
  const todayHours = openingHours[today];
  if (!todayHours || todayHours.closed) return "Closed today";

  return `${todayHours.open} - ${todayHours.close}`;
};

export const formatPhoneForWhatsApp = (phone: string): string => {
  // Remove all non-numeric characters
  return phone.replace(/\D/g, '');
};
