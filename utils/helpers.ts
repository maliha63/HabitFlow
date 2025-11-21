
export const getTodayDateKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getReadableDate = (dateKey: string): string => {
  const [year, month, day] = dateKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export const generateUserId = (): string => {
  let userId = localStorage.getItem('habitFlowUserId');
  if (!userId) {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
    ].join('|');
    userId = btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
    localStorage.setItem('habitFlowUserId', userId);
  }
  return userId;
};

export const triggerHaptic = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10); // Light tap
  }
};

// Security Helper
export const checkPassword = (input: string, hash: string): boolean => {
  // In a real production app we would use a one-way hash like SHA-256.
  // For this PWA, we use Base64 encoding to prevent casual "shoulder surfing" of the code.
  try {
    return btoa(input) === hash;
  } catch (e) {
    return false;
  }
};
