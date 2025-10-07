import {
  ACTION_BLUE,
  BACKGROUND_BLUE,
  GREEN_MINT,
  LIVO_SECONDARY_LIGHT,
} from '@/styles/colors';

import { ShiftModalityEnum } from '@/types';

export const modalityTags: {
  [key in ShiftModalityEnum]: {
    tagCode: ShiftModalityEnum;
    displayText: 'livo_tag_label' | 'internal_tag_label';
    color: string;
    icon: string;
    backgroundColor: string;
  };
} = {
  [ShiftModalityEnum.EXTERNAL]: {
    tagCode: ShiftModalityEnum.EXTERNAL,
    displayText: 'livo_tag_label',
    color: ACTION_BLUE,
    icon: 'livo',
    backgroundColor: BACKGROUND_BLUE,
  },
  [ShiftModalityEnum.INTERNAL]: {
    tagCode: ShiftModalityEnum.INTERNAL,
    displayText: 'internal_tag_label',
    color: GREEN_MINT,
    icon: 'internal-hospital',
    backgroundColor: LIVO_SECONDARY_LIGHT,
  },
};
