import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import { AppText } from './AppText';

interface SectionHeaderProps {
  title: string;
  caption?: string;
  trailing?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, caption, trailing }) => {
  const theme = useTheme();
  return (
    <View style={[styles.row, { marginBottom: theme.spacing.sm }]}>
      <View style={styles.text}>
        <AppText variant="headingMD">{title}</AppText>
        {caption ? (
          <AppText variant="bodySM" color="textMuted" style={styles.caption}>
            {caption}
          </AppText>
        ) : null}
      </View>
      {trailing}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  text: { flex: 1, marginRight: 12 },
  caption: { marginTop: 2 },
});
