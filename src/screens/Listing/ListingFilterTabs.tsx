import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { AppText } from '../../components/AppText';
import { PressableScale } from '../../components/PressableScale';
import { useTheme } from '../../providers/ThemeProvider';
import { ListingStatus } from '../../types';
import { haptics } from '../../utils/haptics';
import { STATUS_LABEL } from './ListingCard';

export type ListingFilter = 'all' | ListingStatus;

const FILTERS: ListingFilter[] = ['all', 'active', 'pending', 'inactive'];

export const filterLabel = (filter: ListingFilter): string =>
  filter === 'all' ? 'All' : STATUS_LABEL[filter];

interface Props {
  value: ListingFilter;
  onChange: (filter: ListingFilter) => void;
}

/**
 * Pill widths vary with each label, so this scrolls horizontally rather than
 * splitting into fixed equal segments — it stays usable without clipping or
 * wrapping on narrow phones no matter how the label set grows.
 */
export const ListingFilterTabs: React.FC<Props> = ({ value, onChange }) => {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      contentContainerStyle={[styles.track, { paddingHorizontal: theme.spacing.lg }]}>
      {FILTERS.map(filter => {
        const selected = filter === value;
        return (
          <PressableScale
            key={filter}
            onPress={() => {
              if (!selected) {
                haptics.selection();
                onChange(filter);
              }
            }}
            activeScale={0.96}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`${filterLabel(filter)} records`}
            style={[
              styles.pill,
              {
                minHeight: theme.layout.minTouchTarget - 8,
                borderRadius: theme.radius.pill,
                backgroundColor: selected ? theme.colors.primarySoft : theme.colors.input,
              },
            ]}>
            <AppText
              variant="bodySM"
              rawColor={selected ? theme.colors.primary : theme.colors.textSecondary}
              maxFontSizeMultiplier={1.3}>
              {filterLabel(filter)}
            </AppText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  track: { flexDirection: 'row', alignItems: 'center' },
  pill: { paddingHorizontal: 16, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
});
