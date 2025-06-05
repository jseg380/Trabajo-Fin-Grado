import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { API_URL } from '@/constants/config';

export default function ProfileButton() {
  const imageUri = new URL('/images/generic-avatar-2.png', API_URL).href;

  return (
    <Link
      href='/profile/developer'
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
