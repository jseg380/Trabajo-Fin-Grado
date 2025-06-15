import { Alert, Platform } from 'react-native';

/**
 * A cross-platform function to show a simple informational alert.
 * Uses native Alert on mobile and window.alert on web.
 * @param title The title of the alert.
 * @param message The message body of the alert.
 */
export const showInfoAlert = (title: string, message: string): void => {
  if (Platform.OS === 'web') {
    // Browsers typically only show the message in a simple alert.
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

/**
 * A cross-platform function to show a confirmation dialog.
 * Uses native Alert on mobile and window.confirm on web.
 * Returns a Promise that resolves to true if the user confirms, and false otherwise.
 * @param title The title of the confirmation dialog.
 * @param message The message body of the dialog.
 * @param confirmText The text for the confirmation button (e.g., 'Delete'). Defaults to 'OK'.
 * @param cancelText The text for the cancellation button. Defaults to 'Cancel'.
 * @returns A Promise<boolean> indicating the user's choice.
 */
export const showConfirmationAlert = (
  title: string,
  message: string,
  confirmText: string = 'OK',
  cancelText: string = 'Cancel'
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      const result = window.confirm(`${title}\n\n${message}`);
      resolve(result);
    } else {
      Alert.alert(
        title,
        message,
        [
          {
            text: cancelText,
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: confirmText,
            onPress: () => resolve(true),
            style: 'destructive', // This will make the button red on iOS
          },
        ],
        { cancelable: true, onDismiss: () => resolve(false) }
      );
    }
  });
};
