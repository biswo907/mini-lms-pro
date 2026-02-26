import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
// Request permissions for notifications.
  requestPermissions: async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === "granted";
  },

// Schedule a notification for when the user bookmarks 5 or more courses.
  scheduleBookmarkMilestoneNotification: async (bookmarkCount: number) => {
    if (bookmarkCount !== 5) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Achievement Unlocked! 🎯",
        body: "You've bookmarked 5 courses! Ready to start learning?",
        data: { type: "bookmark_milestone" },
      },
      trigger: null, // show immediately
    });
  },

 
  scheduleInactivityReminder: async () => {
    await NotificationService.cancelInactivityReminders();

    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 24 * 60 * 60,
      repeats: false,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "We miss you! 📚",
        body: "Come back and continue your learning journey on Mini LMS Pro.",
        data: { type: "inactivity_reminder" },
      },
      trigger,
    });
  },

//  Cancel all inactivity reminders.
  cancelInactivityReminders: async () => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const inactivityReminders = scheduledNotifications.filter(
      (n) => n.content.data?.type === "inactivity_reminder"
    );

    for (const reminder of inactivityReminders) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }
  },
};
