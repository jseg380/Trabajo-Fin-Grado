import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { BACKEND_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';

export default function ProfileButton() {
  const { user } = useAuth();

  // If there's no user logged in, don't render the button at all.
  // The withAuth HOC should prevent this, but it's good practice.
  if (!user) {
    return null; 
  }

  // Use the user's avatar from the context.
  // The 'avatarUrl' should be constructed on the backend and sent on login.
  // If it's not available on login, construct it here.
  const imageUri = user.avatarUrl || new URL(user.avatar, BACKEND_URL).href;

  return (
    <Link
      href='/profile'
      asChild
    >
      <Pressable style={{ marginRight: 15 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <Image
            style={{ width: '100%', height: '100%' }}
            placeholder={{ uri: imageUri }}
          />
        </View>
      </Pressable>
    </Link>
  );
}
