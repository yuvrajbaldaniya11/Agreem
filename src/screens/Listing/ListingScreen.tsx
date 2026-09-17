import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, StyleSheet, View, ViewStyle } from 'react-native';
import { FlashList, FlashListRef, ListRenderItemInfo } from '@shopify/flash-list';
import { useScrollToTop } from '@react-navigation/native';
import { AppHeader } from '../../components/AppHeader';
import { ContentContainer, Screen } from '../../components/Screen';
import { StateView } from '../../components/StateViews';
import { useListing } from '../../hooks/useListing';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { ListingItem } from '../../types';
import { ListingCard } from './ListingCard';
import { filterLabel, ListingFilter, ListingFilterTabs } from './ListingFilterTabs';
import { ListingSkeleton } from './ListingSkeleton';

/** Full-bleed hairline shared by every row, aligned to the same gutter as their text. */
const ListSeparator: React.FC = () => {
  const theme = useTheme();
  return (
    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: theme.colors.divider }} />
  );
};

export const ListingScreen: React.FC = () => {
  const theme = useTheme();
  const { showToast } = useToast();
  const { status, items, isRefreshing, refresh, retry } = useListing();
  const [filter, setFilter] = useState<ListingFilter>('all');

  const listRef = useRef<FlashListRef<ListingItem>>(null);
  useScrollToTop(listRef);

  const filteredItems = useMemo(
    () => (filter === 'all' ? items : items.filter(item => item.status === filter)),
    [items, filter],
  );

  const handlePressItem = useCallback(
    (item: ListingItem) => {
      showToast({ message: item.email, variant: 'info' });
    },
    [showToast],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ListingItem>) => (
      <ListingCard item={item} index={index} onPress={handlePressItem} />
    ),
    [handlePressItem],
  );

  const keyExtractor = useCallback((item: ListingItem) => item.id, []);

  const contentStyle = useMemo<ViewStyle[]>(
    () => [
      styles.content,
      {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
        paddingTop: theme.spacing.md,
        // Caps line length on large phones without breaking edge-to-edge scroll.
        width: '100%',
        maxWidth: theme.layout.maxContentWidth,
        alignSelf: 'center',
      },
    ],
    [theme.layout.maxContentWidth, theme.spacing.lg, theme.spacing.md, theme.spacing.xxl],
  );

  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={refresh}
      tintColor={theme.colors.primary}
      colors={[theme.colors.primary]}
      progressBackgroundColor={theme.colors.surface}
    />
  );

  const subtitle =
    status === 'success' && items.length > 0 ? `${filteredItems.length} records` : 'Team directory';

  return (
    <Screen>
      <AppHeader
        title="Directory"
        subtitle={subtitle}
        action={{ icon: 'refresh', label: 'Refresh the list', onPress: refresh }}
      />

      {status === 'success' && items.length > 0 ? (
        <View style={{ paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.xs }}>
          <ListingFilterTabs value={filter} onChange={setFilter} />
        </View>
      ) : null}

      {status === 'loading' ? (
        <View style={contentStyle}>
          <ContentContainer>
            <ListingSkeleton />
          </ContentContainer>
        </View>
      ) : status === 'error' ? (
        <StateView
          tone="error"
          icon="alert"
          title="We couldn't load the list"
          message="Something went wrong while building the directory. Give it another go."
          actionLabel="Retry"
          onAction={retry}
        />
      ) : (
        <ContentContainer style={styles.listWrap}>
          <FlashList
            ref={listRef}
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ListSeparator}
            contentContainerStyle={filteredItems.length === 0 ? styles.emptyContent : undefined}
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}
            ListEmptyComponent={
              items.length === 0 ? (
                <StateView
                  icon="inbox"
                  title="No records yet"
                  message="When records are added to this workspace they will show up here."
                  actionLabel="Refresh"
                  onAction={refresh}
                />
              ) : (
                <StateView
                  icon="search"
                  title={`No ${filterLabel(filter).toLowerCase()} records`}
                  message="No records match the selected filter."
                  actionLabel="View all"
                  onAction={() => setFilter('all')}
                />
              )
            }
          />
        </ContentContainer>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { flexGrow: 1 },
  emptyContent: { flexGrow: 1, justifyContent: 'center' },
  listWrap: { flex: 1 },
});
