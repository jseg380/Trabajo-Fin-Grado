import { HeaderBackButton } from '@react-navigation/elements';
import { Href, router } from 'expo-router';

interface CustomHeaderBackButtonProps {
  route: Href;
}

const handleGoBack = (route: Href) => {
  if (router.canDismiss()) {
    router.back();
  } else {
    router.replace(route);
  }
};

export default function CustomHeaderBackButton({ route = '/' }: CustomHeaderBackButtonProps) {
  return <HeaderBackButton onPress={() => handleGoBack(route)} />;
}
