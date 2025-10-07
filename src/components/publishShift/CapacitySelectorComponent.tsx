import React from 'react';
import { View } from 'react-native';
import { SPACE_VALUES } from '@/styles/spacing';
import SelectTags from '@/components/common/CustomSelectTags';

interface CapacitySelectorComponentProps {
  capacity: string;
  setCapacity: (selectedTag: string) => void;
  minimumCapacity?: number;
}

export const CapacitySelectorComponent: React.FC<
  CapacitySelectorComponentProps
> = ({ capacity, setCapacity, minimumCapacity = 0 }) => {
  const capacityItems = [
    { label: '1', id: '1' },
    { label: '2', id: '2' },
    { label: '3', id: '3' },
    { label: '4', id: '4' },
    { label: '5', id: '5' },
  ].reduce((acc, item) => {
    if (+item.id < minimumCapacity) {
      acc.push({ ...item, isDisabled: true });
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as { label: string; id: string; isDisabled?: boolean }[]);

  return (
    <View
      style={{
        marginBottom: SPACE_VALUES.large,
      }}
    >
      <SelectTags
        tags={capacityItems}
        onSelectTag={setCapacity}
        previouslySelectedTag={capacity}
        tagContainerStyle={{
          flex: 1,
        }}
      />
    </View>
  );
};
