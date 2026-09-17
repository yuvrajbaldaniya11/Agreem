import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { BottomSheet } from '../../components/BottomSheet';
import { Icon } from '../../components/Icon';
import { PressableScale } from '../../components/PressableScale';
import { StateView } from '../../components/StateViews';
import { COUNTRIES } from '../../constants/countries';
import { useTheme } from '../../providers/ThemeProvider';
import { Country } from '../../types';
import { haptics } from '../../utils/haptics';

interface Props {
  visible: boolean;
  selectedCode: string | null;
  onClose: () => void;
  onSelect: (country: Country) => void;
}

const CountryRow: React.FC<{
  country: Country;
  selected: boolean;
  onPress: (country: Country) => void;
}> = ({ country, selected, onPress }) => {
  const theme = useTheme();

  return (
    <PressableScale
      onPress={() => onPress(country)}
      activeScale={0.99}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${country.name}, ${country.dialCode}`}
      style={[
        styles.row,
        styles.rowBase,
        {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
        },
        selected && { backgroundColor: theme.colors.primarySoft },
      ]}>
      <AppText variant="headingMD" style={styles.flag}>
        {country.flag}
      </AppText>
      <View style={styles.rowText}>
        <AppText variant="title" numberOfLines={1} color={selected ? 'primary' : 'textPrimary'}>
          {country.name}
        </AppText>
        <AppText variant="bodySM" color="textMuted">
          {country.dialCode}
        </AppText>
      </View>
      {selected ? <Icon name="check" size={18} color={theme.colors.primary} strokeWidth={2.4} /> : null}
    </PressableScale>
  );
};

export const CountrySheet: React.FC<Props> = ({ visible, selectedCode, onClose, onSelect }) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const listRef = useRef<FlatList<Country>>(null);

  // Each opening starts from a clean search.
  useEffect(() => {
    if (visible) {
      setQuery('');
    }
  }, [visible]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return COUNTRIES;
    }
    return COUNTRIES.filter(
      country =>
        country.name.toLowerCase().includes(trimmed) ||
        country.code.toLowerCase().startsWith(trimmed) ||
        country.dialCode.includes(trimmed),
    );
  }, [query]);

  const handleSelect = useCallback(
    (country: Country) => {
      haptics.selection();
      onSelect(country);
    },
    [onSelect],
  );

  const renderItem = useCallback(
    ({ item }: { item: Country }) => (
      <CountryRow country={item} selected={item.code === selectedCode} onPress={handleSelect} />
    ),
    [handleSelect, selectedCode],
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Select country">
      <View style={{ padding: theme.spacing.lg, paddingBottom: theme.spacing.sm }}>
        <View
          style={[
            styles.search,
            {
              backgroundColor: theme.colors.input,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.medium,
              paddingHorizontal: theme.spacing.sm,
              minHeight: theme.layout.minTouchTarget,
            },
          ]}>
          <Icon name="search" size={17} color={theme.colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search countries"
            placeholderTextColor={theme.colors.textMuted}
            selectionColor={theme.colors.primary}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel="Search countries"
            maxFontSizeMultiplier={1.4}
            style={[theme.typography.bodyMD, styles.searchInput, { color: theme.colors.textPrimary }]}
          />
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={results}
        renderItem={renderItem}
        keyExtractor={item => item.code}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={14}
        maxToRenderPerBatch={14}
        windowSize={9}
        removeClippedSubviews
        contentContainerStyle={[
          { paddingBottom: theme.spacing.xl },
          results.length === 0 && styles.emptyContent,
        ]}
        ListEmptyComponent={
          <StateView
            compact
            icon="search"
            title="No country found"
            message={`We couldn't match "${query.trim()}". Try a different spelling.`}
          />
        }
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBase: { backgroundColor: 'transparent' },
  flag: { width: 34 },
  rowText: { flex: 1, marginLeft: 6, marginRight: 8 },
  search: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 8, paddingVertical: 10 },
  emptyContent: { flexGrow: 1, justifyContent: 'center' },
});
