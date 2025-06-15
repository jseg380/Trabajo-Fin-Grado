import React, { useEffect, useState } from 'react';
import { Menu, Button, ActivityIndicator } from 'react-native-paper';
import { Text, View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGE_KEY } from '@/localization';
import { Stack } from 'expo-router';
import TitleSetterWebPage from '@/components/TitleSetter';
import { withAuth } from '@/utils/withAuth';
import CustomHeaderBackButton from '@/components/CustomHeaderBackButton';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { showInfoAlert } from '@/utils/CrossPlatformAlert';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '@/constants/config';

type OptionConfig = {
  [key: string]: string;
};

const languageOptions: OptionConfig = {
  'Español (España)': 'es-ES',
  'English (United Kingdom)': 'en-UK',
};

const distanceUnitsOptions: OptionConfig = {
  Kilometers: 'km',
  Miles: 'mi',
};

const fuelEfficiencyUnitsOptions: OptionConfig = {
  'Liters per 100 km': 'l/100km',
  'Miles per gallon (UK)': 'mpg-uk',
  'Miles per gallon (US)': 'mpg-us',
};

function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();

  // --- State Management ---
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null); // Controls which menu is open
  const [selectedLanguageLabel, setSelectedLanguageLabel] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLanguageChange = async (label: string, value: string) => {
    setSelectedLanguageLabel(label);
    i18n.changeLanguage(value);
    // The menu is now closed by the SettingsMenu component itself.
    await AsyncStorage.setItem(LANGUAGE_KEY, value);
  };

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((value) => {
      const languageCode = value;
      const languageLabel = Object.keys(languageOptions).find((label) => languageOptions[label] === languageCode);
      setSelectedLanguageLabel(languageLabel || null);
    });
  }, []);

  const pickAndUploadImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showInfoAlert(t('settings.alerts.permission_required'), t('settings.alerts.permission_message'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();

    if (Platform.OS === 'web') {
      // On web, we fetch the blob data from the blob: URL
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      formData.append('avatar', blob, asset.uri.split('/').pop() || 'photo.jpg');
    } else {
      // On native, we use the special { uri, name, type } object
      const localUri = asset.uri;
      const filename = localUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append('avatar', { uri: localUri, name: filename, type } as any);
    }

    setIsUploading(true);
    try {
      const response = await axios.put(new URL('users/profile/avatar', API_URL).href, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      updateUser({ avatar: response.data.avatar, avatarUrl: response.data.avatarUrl });
      showInfoAlert(t('settings.alerts.upload_success'), t('settings.alerts.upload_success_message'));
    } catch (err) {
      showInfoAlert(t('settings.alerts.upload_failed'), t('settings.alerts.upload_failed_message'));
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // A generic component for our settings sections
  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  // A generic component for our dropdown menus
  const SettingsMenu = ({
    menuKey,
    label,
    options,
    onSelect,
  }: {
    menuKey: string;
    label: string;
    options: OptionConfig;
    onSelect: (label: string, value: string) => void;
  }) => (
    <Menu
      visible={visibleMenu === menuKey}
      onDismiss={() => setVisibleMenu(null)}
      anchor={
        <Button
          mode='outlined'
          onPress={() => setVisibleMenu(menuKey)}
          style={styles.menuButton}
        >
          {label}
        </Button>
      }
    >
      {Object.entries(options).map(([lbl, val]) => (
        <Menu.Item
          key={val}
          onPress={() => {
            onSelect(lbl, val);
            setVisibleMenu(null);
          }}
          title={lbl}
        />
      ))}
    </Menu>
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: t('pages.settings.title'),
          headerLeft: () => <CustomHeaderBackButton route='/profile' />,
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Ionicons
                name='settings-sharp'
                size={22}
                color='black'
                style={{ marginRight: 8 }}
              />
              <Text style={styles.headerTitleText}>{t('pages.settings.title')}</Text>
            </View>
          ),
        }}
      />
      <TitleSetterWebPage title={t('pages.settings.title')} />

      {/* Profile Picture Section */}
      <SettingsSection title={t('settings.profile_picture.meta')}>
        {isUploading ? (
          <ActivityIndicator size='large' />
        ) : (
          <Button
            icon='camera'
            mode='contained'
            onPress={pickAndUploadImage}
            style={styles.pictureButton}
          >
            {t('settings.profile_picture.change_button')}
          </Button>
        )}
      </SettingsSection>

      {/* Language Section */}
      <SettingsSection title={t('settings.language.meta')}>
        <SettingsMenu
          menuKey='language'
          label={selectedLanguageLabel || t('settings.language.select')}
          options={languageOptions}
          onSelect={handleLanguageChange}
        />
      </SettingsSection>

      {/* Units Section */}
      <SettingsSection title={t('settings.units.meta')}>
        <SettingsMenu
          menuKey='distance'
          label={t('settings.units.distance_select')}
          options={distanceUnitsOptions}
          onSelect={(label, value) => console.log('Distance Unit:', value)}
        />
        <View style={{ height: 16 }} />
        <SettingsMenu
          menuKey='fuel'
          label={t('settings.units.fuel_select')}
          options={fuelEfficiencyUnitsOptions}
          onSelect={(label, value) => console.log('Fuel Unit:', value)}
        />
      </SettingsSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  menuButton: {
    paddingVertical: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pictureButton: {
    paddingVertical: 4,
    backgroundColor: '#007AFF',
  }
});

export default withAuth(SettingsScreen);
