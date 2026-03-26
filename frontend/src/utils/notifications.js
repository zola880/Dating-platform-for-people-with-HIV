/**
 * Request permission for browser notifications.
 * Returns true if granted, false otherwise.
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

/**
 * Show a browser notification.
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string} icon - URL to an icon (optional)
 * @param {string} url - URL to open when notification is clicked (optional)
 */
export const showNotification = (title, body, icon = '/logo192.png', url = null) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  const notification = new Notification(title, { body, icon });
  if (url) {
    notification.onclick = () => {
      window.focus();
      window.location.href = url;
      notification.close();
    };
  }
  setTimeout(() => notification.close(), 5000); // auto close after 5 seconds
};