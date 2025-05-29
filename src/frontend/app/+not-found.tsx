// import { View, StyleSheet } from 'react-native';
// import { Link, Stack, router } from 'expo-router';

// export default function NotFoundScreen() {
//   return (
//     <>
//       <Stack.Screen options={{ title: 'Oops! Not Found' }} />
//       <View style={styles.container}>
//         <Link
//           href='/'
//           style={styles.button}
//           onPress={(e) => {
//             e.preventDefault();
//             router.replace('/');
//           }}
//         >
//           Go back to Home screen!
//         </Link>
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#25292e',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   button: {
//     fontSize: 20,
//     textDecorationLine: 'underline',
//     color: '#fff',
//   },
// });
import { View, Text, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! Not found</Text>
      <Text style={styles.subtitle}>Error 404 - Page Not Found</Text>
      <Link
        href='/'
        style={styles.button}
        onPress={(e) => {
          e.preventDefault();
          router.replace('/');
        }}
      >
        Go to home screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    color: '#fff',
    borderRadius: 5,
  },
});
