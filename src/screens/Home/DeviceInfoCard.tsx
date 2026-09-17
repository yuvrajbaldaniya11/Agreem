import React, { useCallback } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { StyleSheet, View } from 'react-native';
import { Card } from '../../components/Card';
import { InfoRow } from '../../components/InfoRow';
import { Skeleton, useShimmer } from '../../components/Skeleton';
import { StateView } from '../../components/StateViews';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { DeviceConsent } from '../../hooks/useDeviceDetails';
import { formatDeviceName, isUnavailable } from '../../services/device';
import { AsyncStatus, DeviceDetails } from '../../types';
import { maskIdentifier } from '../../utils/format';
import { haptics } from '../../utils/haptics';

interface Props {
  consent: DeviceConsent;
  status: AsyncStatus;
  details: DeviceDetails | null;
  onAllow: () => void;
  onRetry: () => void;
}

const DeviceInfoSkeleton: React.FC = () => {
  const theme = useTheme();
  const shimmer = useShimmer();

  return (
    <View accessibilityLabel="Loading device information">
      {[0, 1, 2, 3, 4].map(index => (
        <View key={index} style={[styles.row, { paddingVertical: theme.spacing.sm }]}>
          <Skeleton width={36} height={36} progress={shimmer} radius={theme.radius.small} />
          <View style={styles.rowText}>
            <Skeleton width="34%" height={9} progress={shimmer} />
            <Skeleton width="62%" height={13} progress={shimmer} style={styles.rowValue} />
          </View>
        </View>
      ))}
    </View>
  );
};

export const DeviceInfoCard: React.FC<Props> = ({ consent, status, details, onAllow, onRetry }) => {
  const { showToast } = useToast();

  const copyDeviceId = useCallback(() => {
    if (!details || isUnavailable(details.deviceId)) {
      return;
    }
    Clipboard.setString(details.deviceId);
    haptics.confirm();
    showToast({ message: 'Device ID copied to clipboard.', variant: 'success' });
  }, [details, showToast]);

  // Nothing is read from the device until the user explicitly allows it.
  if (consent === 'pending') {
    return (
      <Card>
        <StateView
          compact
          tone="accent"
          icon="shield"
          title="Read this device's details?"
          message="Agreem would like to read basic, non-personal device information — brand, model, OS version and a device ID — to show it on this screen."
          actionLabel="Allow"
          onAction={onAllow}
        />
      </Card>
    );
  }

  if (consent === 'unknown' || status === 'loading' || (status === 'success' && !details)) {
    return (
      <Card>
        <DeviceInfoSkeleton />
      </Card>
    );
  }

  if (status === 'error' || !details) {
    return (
      <Card>
        <StateView
          compact
          tone="error"
          icon="alert"
          title="Device details unavailable"
          message="We could not read this device's information. You can try again."
          actionLabel="Try again"
          onAction={onRetry}
        />
      </Card>
    );
  }

  const canCopyId = !isUnavailable(details.deviceId);

  return (
    <Card>
      <InfoRow
        icon="smartphone"
        label="Device"
        value={formatDeviceName(details.brand, details.model)}
        muted={isUnavailable(details.model) && isUnavailable(details.brand)}
      />
      <InfoRow
        icon="shield"
        label="Operating system"
        value={
          isUnavailable(details.systemVersion)
            ? 'Not available'
            : `${details.os} ${details.systemVersion}${
                isUnavailable(details.apiLevel) ? '' : ` · API ${details.apiLevel}`
              }`
        }
        muted={isUnavailable(details.systemVersion)}
      />
      <InfoRow icon="info" label="Form factor" value={details.deviceType} muted={isUnavailable(details.deviceType)} />
      <InfoRow
        icon="copy"
        label="Device ID"
        value={canCopyId ? maskIdentifier(details.deviceId) : 'Not available'}
        muted={!canCopyId}
        action={
          canCopyId
            ? { icon: 'copy', label: 'Copy device ID to clipboard', onPress: copyDeviceId }
            : undefined
        }
      />
      <InfoRow
        icon="tag"
        label="App version"
        value={details.appVersion}
        muted={isUnavailable(details.appVersion)}
        isLast
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  rowText: { flex: 1, marginLeft: 12 },
  rowValue: { marginTop: 7 },
});
