import { useEffect } from 'react';
import { Platform } from 'react-native';

interface TitleSetterProps {
  title?: string;
}

export default function TitleSetter({ title }: TitleSetterProps) {
  useEffect(() => {
    // Return early if it's not a web platform
    if (Platform.OS !== 'web') return;

    let specificTitle = title ? title + ' - ' : '';

    document.title = specificTitle + 'AlDiaCar';
  }, [title]);

  return null;
}
