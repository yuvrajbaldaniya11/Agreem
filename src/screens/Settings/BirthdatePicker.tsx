import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { AppButton } from '../../components/AppButton';
import { BottomSheet } from '../../components/BottomSheet';
import { SelectField } from '../../components/AppInput';
import { useTheme } from '../../providers/ThemeProvider';
import { MIN_BIRTH_YEAR } from '../../utils/validation';
import { formatDate } from '../../utils/format';

interface Props {
  value: string | null;
  error?: string;
  onChange: (iso: string) => void;
}

const MIN_DATE = new Date(MIN_BIRTH_YEAR, 0, 1);
/** A sensible starting point when nothing has been chosen yet. */
const DEFAULT_DATE = new Date(1995, 0, 1);

export const BirthdatePicker: React.FC<Props> = ({ value, error, onChange }) => {
  const theme = useTheme();
  const [iosVisible, setIosVisible] = useState(false);
  const [iosDraft, setIosDraft] = useState<Date>(DEFAULT_DATE);

  const currentDate = (() => {
    if (!value) {
      return DEFAULT_DATE;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? DEFAULT_DATE : parsed;
  })();

  const commit = useCallback(
    (date: Date) => {
      // Normalised to midday so a timezone shift can never roll the date back.
      const safe = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
      onChange(safe.toISOString());
    },
    [onChange],
  );

  const open = useCallback(() => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: currentDate,
        mode: 'date',
        maximumDate: new Date(),
        minimumDate: MIN_DATE,
        onChange: (event: DateTimePickerEvent, date?: Date) => {
          // 'dismissed' (back button or Cancel) simply leaves the value alone.
          if (event.type === 'set' && date) {
            commit(date);
          }
        },
      });
      return;
    }
    setIosDraft(currentDate);
    setIosVisible(true);
  }, [commit, currentDate]);

  return (
    <>
      <SelectField
        label="Birthdate"
        leadingIcon="calendar"
        placeholder="Select your birthdate"
        value={value ? formatDate(value) : null}
        error={error}
        onPress={open}
        accessibilityHint="Opens a date picker"
      />

      {Platform.OS === 'ios' ? (
        <BottomSheet
          visible={iosVisible}
          onClose={() => setIosVisible(false)}
          title="Birthdate"
          heightRatio={0.5}>
          <View style={[styles.sheetBody, { paddingHorizontal: theme.spacing.lg }]}>
            <DateTimePicker
              value={iosDraft}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              minimumDate={MIN_DATE}
              themeVariant={theme.mode}
              onChange={(_event, date) => {
                if (date) {
                  setIosDraft(date);
                }
              }}
              style={styles.picker}
            />
            <AppButton
              label="Confirm"
              onPress={() => {
                commit(iosDraft);
                setIosVisible(false);
              }}
              style={{ marginBottom: theme.spacing.md }}
            />
          </View>
        </BottomSheet>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  sheetBody: { flex: 1 },
  picker: { flex: 1 },
});
