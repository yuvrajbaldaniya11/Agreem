import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton, useShimmer } from '../../components/Skeleton';
import { useTheme } from '../../providers/ThemeProvider';

const ROWS = [0, 1, 2, 3, 4, 5, 6];

/**
 * Mirrors ListingCard's row geometry exactly so swapping skeleton for data
 * does not shift anything on screen.
 */
export const ListingSkeleton: React.FC = () => {
  const theme = useTheme();
  const shimmer = useShimmer();

  return (
    <View accessibilityLabel="Loading records" accessibilityRole="progressbar">
      {ROWS.map(row => (
        <View
          key={row}
          style={[
            styles.row,
            {
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.lg,
              borderBottomWidth: row === ROWS.length - 1 ? 0 : StyleSheet.hairlineWidth,
              borderBottomColor: theme.colors.divider,
            },
          ]}>
          <Skeleton width={44} height={44} progress={shimmer} radius={theme.radius.pill} />
          <View style={styles.main}>
            <Skeleton width="55%" height={14} progress={shimmer} />
            <Skeleton width="38%" height={11} progress={shimmer} style={styles.gap} />
            <Skeleton width="62%" height={11} progress={shimmer} style={styles.gap} />
            <Skeleton width="46%" height={11} progress={shimmer} style={styles.gap} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  main: { flex: 1, marginLeft: 12 },
  gap: { marginTop: 8 },
});
