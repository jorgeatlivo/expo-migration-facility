import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Row from '@/components/atoms/Row';

import { BACKGROUND_BLUE, WHITE } from '@/styles/colors';
import { typographyStyles } from '@/styles/livoFonts';

export interface TagType {
  id: string;
  label: string;
  isDisabled?: boolean;
}

interface SingleSelectTagProps {
  previouslySelectedTag: string;
  tags: TagType[];
  onSelectTag: (selectedTag: string) => void;
  style?: object;
  color?: string;
}

const SingleSelectTag: React.FC<SingleSelectTagProps> = ({
  previouslySelectedTag,
  tags,
  onSelectTag,
  style,
  color = '#0277C8', // Button/Background/Selector
}) => {
  const [selectedTag, setSelectedTag] = useState<string>(previouslySelectedTag);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    onSelectTag(tag);
  };

  return (
    <Row justifyContent={'center'} wrap flexGrow={1} style={style}>
      {tags.map((tag) => (
        <TouchableOpacity
          disabled={tag.isDisabled}
          key={tag.id}
          style={[
            styles.tagContainer,
            { borderColor: color },
            selectedTag === tag.id && [
              styles.tagContainerSelected,
              { backgroundColor: color },
            ],
            tag.isDisabled && styles.tagContainerDisabled,
          ]}
          onPress={() => handleTagSelect(tag.id)}
        >
          <Text
            numberOfLines={1}
            allowFontScaling={false}
            style={[
              styles.tagText,
              { color: color },
              selectedTag === tag.id && styles.tagTextSelected,
              tag.isDisabled && styles.tagTextDisabled,
            ]}
          >
            {tag.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Row>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    backgroundColor: BACKGROUND_BLUE,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#0277C8', // Button/Background/Selector,
    marginHorizontal: 4,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  tagContainerSelected: {
    backgroundColor: '#0277C8', // Button/Background/Selector,
  },
  tagContainerDisabled: {
    backgroundColor: '#EFF0F2', // Button-Background-Disable,
    borderColor: '#EFF0F2',
  },
  tagText: {
    ...typographyStyles.body.small,
    color: '#0277C8', // Button/Background/Selector,
    textAlign: 'center',
  },
  tagTextSelected: {
    color: WHITE,
  },
  tagTextDisabled: {
    color: '#B3BCC7', // Text/Light
  },
});

export default SingleSelectTag;
