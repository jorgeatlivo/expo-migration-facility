import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { SPACE_VALUES } from '@/styles/spacing';
import StyledText from '@/components/StyledText';
import { FontWeightEnum, typographyStyles } from '@/styles/livoFonts';
import {
  ACTION_BLUE,
  BADGE_GRAY,
  BORDER_GRAY,
  DARK_GRAY,
  DIVIDER_GRAY,
  WHITE,
} from '@/styles/colors';
import Row from '@/components/atoms/Row';

interface TagType {
  id: string;
  label: string;
  isDisabled?: boolean;
}

interface SelectTagProps {
  previouslySelectedTag: string;
  tags: TagType[];
  onSelectTag: (selectedTag: string) => void;
  tagContainerStyle?: any;
}

const SelectTags: React.FC<SelectTagProps> = ({
  previouslySelectedTag,
  tags,
  onSelectTag,
  tagContainerStyle,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>(previouslySelectedTag);

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    onSelectTag(tag);
  };

  return (
    <Row wrap gap={SPACE_VALUES.medium}>
      {tags.map((tag) => (
        <TouchableOpacity
          disabled={tag.isDisabled}
          key={tag.id}
          style={[
            styles.pill,
            selectedTag.includes(tag.id) && styles.selectedPill,
            tagContainerStyle,
            tag.isDisabled ? styles.tagContainerDisabled : {},
          ]}
          onPress={() => handleTagSelect(tag.id)}
        >
          <StyledText
            style={[
              styles.pillLabel,
              selectedTag.includes(tag.id) && styles.selectedLabel,
              tag.isDisabled && styles.tagTextDisabled,
            ]}
          >
            {tag.label}
          </StyledText>
        </TouchableOpacity>
      ))}
    </Row>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_GRAY,
    paddingVertical: SPACE_VALUES.small,
    paddingHorizontal: SPACE_VALUES.medium,
    backgroundColor: WHITE,
    alignItems: 'center',
    flexShrink: 1,
  },
  selectedPill: {
    paddingVertical: SPACE_VALUES.small - 1,
    paddingHorizontal: SPACE_VALUES.medium - 1,
    borderWidth: 2,
    backgroundColor: ACTION_BLUE,
    borderColor: ACTION_BLUE,
  },
  pillLabel: {
    ...typographyStyles.info.caption,
    fontFamily: FontWeightEnum.strong,
    color: BADGE_GRAY,
  },
  selectedLabel: {
    color: WHITE,
  },
  tagContainerDisabled: {
    backgroundColor: DARK_GRAY,
    borderColor: DARK_GRAY,
  },
  tagTextDisabled: {
    color: DIVIDER_GRAY,
  },
});

export default SelectTags;
