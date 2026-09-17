import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { PressableScale } from '../../components/PressableScale';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../providers/ThemeProvider';
import { ListingItem, ListingStatus } from '../../types';
import { formatJoined } from '../../utils/format';

/** Only the first screenful animates in; later rows appear instantly on scroll. */
const ANIMATED_ROWS = 8;
const STAGGER_MS = 45;

export const STATUS_LABEL: Record<ListingStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  inactive: 'Inactive',
};

interface Props {
  item: ListingItem;
  index: number;
  onPress: (item: ListingItem) => void;
}

const ListingCardComponent: React.FC<Props> = ({ item, index, onPress }) => {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const shouldAnimate = index < ANIMATED_ROWS && !reduceMotion;

  const enter = useRef(new Animated.Value(shouldAnimate ? 0 : 1)).current;

  useEffect(() => {
    if (!shouldAnimate) {
      enter.setValue(1);
      return;
    }
    const animation = Animated.timing(enter, {
      toValue: 1,
      duration: 220,
      delay: index * STAGGER_MS,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [enter, index, shouldAnimate]);

  const statusColor =
    item.status === 'active'
      ? theme.colors.success
      : item.status === 'pending'
      ? theme.colors.warning
      : theme.colors.textMuted;

  const statusBackground =
    item.status === 'active'
      ? theme.colors.successSoft
      : item.status === 'pending'
      ? theme.colors.warningSoft
      : theme.colors.input;

  return (
    <Animated.View style={{ opacity: enter }}>
      <PressableScale
        onPress={() => onPress(item)}
        activeScale={0.995}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${item.role}, ${item.location}, ${STATUS_LABEL[item.status]}`}
        accessibilityHint="Shows this record's email address"
        style={[styles.row, { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg }]}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: item.accent + (theme.mode === 'dark' ? '2E' : '1F'), borderRadius: theme.radius.pill },
          ]}>
          <AppText variant="title" rawColor={item.accent}>
            {item.initials}
          </AppText>
        </View>

        <View style={styles.main}>
          <View style={styles.titleRow}>
            <AppText variant="title" numberOfLines={1} style={styles.name}>
              {item.name}
            </AppText>
            <View
              style={[
                styles.status,
                { backgroundColor: statusBackground, borderRadius: theme.radius.pill },
              ]}>
              {/* A dot plus a word: status never relies on colour alone. */}
              <View style={[styles.dot, { backgroundColor: statusColor }]} />
              <AppText variant="caption" rawColor={statusColor} maxFontSizeMultiplier={1.2}>
                {STATUS_LABEL[item.status]}
              </AppText>
            </View>
          </View>

          <AppText variant="bodySM" color="textSecondary" numberOfLines={1} style={styles.role}>
            {item.role}
          </AppText>

          <View style={[styles.metaRow, { marginTop: theme.spacing.xs }]}>
            <Icon name="globe" size={13} color={theme.colors.textMuted} />
            <AppText variant="bodySM" color="textMuted" numberOfLines={1} style={styles.metaText}>
              {item.location}
            </AppText>
          </View>
          <View style={styles.metaRow}>
            <Icon name="calendar" size={13} color={theme.colors.textMuted} />
            <AppText variant="bodySM" color="textMuted" numberOfLines={1} style={styles.metaText}>
              {formatJoined(item.joinedAt)}
            </AppText>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
};

export const ListingCard = memo(ListingCardComponent);

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  avatar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, marginLeft: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  name: { flex: 1, marginRight: 8 },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  role: { marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  metaText: { marginLeft: 6, flex: 1 },
});
