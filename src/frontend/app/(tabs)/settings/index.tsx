import React, { useState } from 'react';
import { Menu, Divider, Button } from 'react-native-paper';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGE_KEY } from '@/localization';

export default function Index() {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const options = {
    'Español (España)': 'es-ES',
    'English (United Kingdom)': 'en-UK',
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'black' }}>{t('language.meta')}</Text>

      <View style={{ padding: 20 }}>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Button onPress={() => setVisible(true)}>
              {selected || t('language.select')}
            </Button>
          }>
          {Object.entries(options).map(([label, value], index) => (
            <React.Fragment key={value}>
              <Menu.Item
                onPress={async () => {
                  setSelected(label);
                  i18n.changeLanguage(value);
                  setVisible(false);
                  await AsyncStorage.setItem(LANGUAGE_KEY, value); // Save to storage
                }}
                title={label}
              />
              {index < Object.keys(options).length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Menu>
      </View>
    </View>
  );
}
