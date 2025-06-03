import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';

export default function ProfileButton() {
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
            placeholder={require('@/assets/images/generic-avatar.png')}
          />
        </View>
      </Pressable>
    </Link>
  );
}
