import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const parseTime = (hhmm = '21:00') => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm);
  if (!match) return { hour: 21, minute: 0 };
  return { hour: Number(match[1]), minute: Number(match[2]) };
};

export const ensureNotificationPermission = async () => {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('daily-reminder', {
    name: 'Daily Reminder',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

export const scheduleDailyReminder = async (time = '21:00') => {
  const granted = await ensureNotificationPermission();
  if (!granted) return null;

  await ensureAndroidChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();
  const { hour, minute } = parseTime(time);

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Expense Reminder',
      body: "Don't forget to log your expenses today!",
      sound: false,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
      channelId: Platform.OS === 'android' ? 'daily-reminder' : undefined,
    },
  });
};

export const disableDailyReminder = async () => Notifications.cancelAllScheduledNotificationsAsync();
