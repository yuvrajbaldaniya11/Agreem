import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { BottomSheet } from '../../components/BottomSheet';
import { Icon, IconName } from '../../components/Icon';
import { PressableScale } from '../../components/PressableScale';
import { StateView } from '../../components/StateViews';
import { PhotoState } from '../../hooks/useSelectedPhoto';
import { useTheme } from '../../providers/ThemeProvider';
import { haptics } from '../../utils/haptics';

interface RowProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
  loading?: boolean;
}

const Row: React.FC<RowProps> = ({ icon, label, onPress, tone = 'default', loading }) => {
  const theme = useTheme();
  const color = tone === 'danger' ? theme.colors.error : theme.colors.textPrimary;

  return (
    <PressableScale
      onPress={onPress}
      disabled={loading}
      activeScale={0.99}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.row,
        { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg },
      ]}>
      <View style={styles.rowIcon}>
        {loading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Icon name={icon} size={20} color={color} />
        )}
      </View>
      <AppText variant="title" rawColor={color}>
        {label}
      </AppText>
    </PressableScale>
  );
};

interface Props {
  visible: boolean;
  onClose: () => void;
  photo: PhotoState;
}

/**
 * The single entry point for changing the profile photo, opened from the
 * avatar's edit badge. Dismisses itself before handing off to the native
 * picker so the OS gallery never appears stacked on top of our own sheet.
 */
export const ProfilePhotoSheet: React.FC<Props> = ({ visible, onClose, photo }) => {
  const theme = useTheme();

  const handlePick = useCallback(() => {
    haptics.selection();
    onClose();
    photo.pickPhoto();
  }, [onClose, photo]);

  const handleRemove = useCallback(() => {
    haptics.selection();
    onClose();
    photo.removePhoto();
  }, [onClose, photo]);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Profile photo" autoHeight heightRatio={0.55}>
      {photo.permission === 'blocked' ? (
        <View style={{ padding: theme.spacing.lg }}>
          <StateView
            compact
            tone="warning"
            icon="lock"
            title="Photo access is turned off"
            message="Agreem needs photo access to set a profile photo. You can turn it back on in system settings."
            actionLabel="Open settings"
            onAction={photo.openSettings}
          />
        </View>
      ) : (
        <View style={{ paddingVertical: theme.spacing.xs }}>
          <Row icon="image" label="Choose from library" onPress={handlePick} loading={photo.isOpening} />
          {photo.photo ? (
            <Row icon="trash" label="Remove photo" tone="danger" onPress={handleRemove} />
          ) : null}
          {photo.error ? (
            <AppText
              variant="bodySM"
              color="error"
              style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xs }}>
              {photo.error}
            </AppText>
          ) : null}
        </View>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { width: 32, alignItems: 'flex-start' },
});
