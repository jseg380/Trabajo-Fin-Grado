import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator } from 'react-native';

export function withAuth(Component: React.ComponentType) {
  return function ProtectedComponent(props: any) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <ActivityIndicator
          size='large'
          style={{ flex: 1 }}
        />
      );
    }

    if (!user) {
      return <Redirect href='/(auth)/login' />;
    }

    return <Component {...props} />;
  };
}
