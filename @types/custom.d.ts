// custom.d.ts
declare module '@react-native-community/datetimepicker' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';
  
    interface DateTimePickerProps {
      testID?: string;
      value: Date;
      mode: 'date' | 'time' | 'datetime';
      is24Hour?: boolean;
      display?: 'default' | 'spinner' | 'calendar' | 'clock';
      onChange: (event: any, selectedDate?: Date) => void;
      style?: ViewStyle;
    }
  
    export default class DateTimePicker extends Component<DateTimePickerProps> {}
  }