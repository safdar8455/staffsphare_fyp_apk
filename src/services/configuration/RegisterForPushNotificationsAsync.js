import { Permissions, Notifications } from "expo";
import { AddDeviceToken } from "../api/AccountService";

export async function getPushNotificationExpoTokenAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log(`Notification: ${finalStatus}`);
    return null;
  }

  let token = await Notifications.getExpoPushTokenAsync();
  return token;
}

export async function registerForPushNotificationsAsync() {
  
  var token = await getPushNotificationExpoTokenAsync();
  AddDeviceToken(token);
}
