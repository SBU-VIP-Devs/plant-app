import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
}

export default function Calendar({ onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const selectDate = (day: number) => {
    if (day) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(newDate);
      onDateSelect?.(newDate);
    }
  };

  const isSelected = (day: number) => {
    if (!day) return false;
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dayDate.toDateString() === selectedDate.toDateString();
  };

  const hasEvent = (day: number) => {
    // Mock function - you can replace this with actual event checking logic
    return day === 4; // Friday has an event
  };

  const days = getDaysInMonth(currentDate);

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{monthNames[currentDate.getMonth()]}</Text>
        <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />

      {/* Day Names */}
      <View style={styles.dayNamesRow}>
        {dayNames.map((day, index) => (
          <Text key={index} style={styles.dayName}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            {day && (
              <TouchableOpacity
                style={[
                  styles.dayButton,
                  isSelected(day) && styles.selectedDay,
                ]}
                onPress={() => selectDate(day)}
              >
                <Text style={[
                  styles.dayText,
                  isSelected(day) && styles.selectedDayText
                ]}>
                  {day}
                </Text>
                {hasEvent(day) && <View style={styles.eventDot} />}
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F7D9',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  navButton: {
    padding: 10,
  },
  navArrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3e46',
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2f3e46',
    marginBottom: 15,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayContainer: {
    width: 40,
    height: 40,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#C8E6C9',
  },
  dayText: {
    fontSize: 16,
    color: '#2f3e46',
    fontFamily: 'Quicksand-Regular',
  },
  selectedDayText: {
    fontFamily: 'Quicksand-Bold',
  },
  eventDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2f3e46',
  },
});
