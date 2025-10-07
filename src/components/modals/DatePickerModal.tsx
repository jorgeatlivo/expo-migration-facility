import { useCallback } from 'react';
import { Platform } from 'react-native';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { useModal } from '@/hooks/ModalContext';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';

interface DatePickerModalProps {
  mode: 'date' | 'time';
  value: Date;
  onSelectedTimeHandler: (date: Date) => void;
  minimumDate?: Date;
  onDismissed?: () => void;
}

export function DatePickerModal(props: DatePickerModalProps) {
  const lang = useCurrentLocale();

  const display =
    Platform.OS === 'ios'
      ? props.mode === 'time'
        ? 'spinner'
        : 'inline'
      : 'default';

  const onSelectTime = useCallback(
    (_: DateTimePickerEvent, date?: Date) => {
      if (date) {
        props.onSelectedTimeHandler(date);
      }

      if (props.mode === 'date' || Platform.OS === 'android') {
        props.onDismissed?.();
      }
    },
    [props.onSelectedTimeHandler, props.mode]
  );

  return (
    <DateTimePicker
      value={props.value}
      mode={props.mode}
      display={display}
      onChange={onSelectTime}
      minimumDate={props.minimumDate}
      style={{ alignSelf: 'center' }}
      locale={lang}
    />
  );
}

export function useDatePickerModal(modalName: string) {
  const { configureBottomModal, hideModal } = useModal();

  return {
    showModal: (props: DatePickerModalProps) => {
      configureBottomModal(
        <DatePickerModal
          {...props}
          onDismissed={() => {
            props.onDismissed?.();
            hideModal(modalName);
          }}
        />,
        modalName,
        false
      );
    },
    hideModal,
  };
}
