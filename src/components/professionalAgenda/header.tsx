import React from "react";
import { View, TouchableOpacity } from "react-native"
import LivoIcon from "../../assets/icons/LivoIcon"
import { typographyStyles } from "../../styles/livoFonts"
import { SPACE_VALUES } from "../../styles/spacing"
import { formattedMonth, formattedShortMonth } from "../../utils/utils"
import StyledText from "../StyledText"
import { ShiftTimeInDayEnum } from "../../types"
import { shiftTimeInDayLabels } from "../claimReviews/Separators"
import { WHITE } from "../../styles/colors"
import { useTranslation } from "react-i18next";

interface ProfessionalAgendaHeaderProps {
    date?: string;
    onClickLeft?: () => void;
    onClickRight?: () => void;
    shiftTimeInDay?: ShiftTimeInDayEnum
}
export const ProfessionalAgendaHeader: React.FC<ProfessionalAgendaHeaderProps> = ({
    date,
    onClickLeft,
    onClickRight,
    shiftTimeInDay
}) => {
    const { t } = useTranslation();
    return (
        <View
            style={{
                paddingTop: SPACE_VALUES.tiny,
                paddingBottom: SPACE_VALUES.small,
                borderBottomWidth: 1,
                borderBottomColor: '#C6D0DB',
                backgroundColor: WHITE
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <TouchableOpacity
                    disabled={!onClickLeft}
                    style={{
                        padding: SPACE_VALUES.medium
                    }}
                    onPress={onClickLeft}
                >
                    <LivoIcon name="chevron-left" size={24} color={onClickLeft ? '#149EF2' : '#C6D0DB'} />
                </TouchableOpacity>
                {date && shiftTimeInDay ? <View
                    style={{
                        flex: 1,
                    }}
                >
                    <StyledText
                        style={{
                            ...typographyStyles.info.caption,
                            textAlign: 'center'
                        }}
                    >
                        {formattedMonth(date)}
                    </StyledText>
                    <StyledText
                        style={{
                            ...typographyStyles.heading.small,
                            textAlign: 'center'
                        }}
                    >
                        <StyledText
                            style={{
                                ...typographyStyles.heading.small,
                                color: shiftTimeInDayLabels[shiftTimeInDay as keyof typeof shiftTimeInDayLabels].textColor,
                            }}
                        >
                            {t(shiftTimeInDayLabels[shiftTimeInDay as keyof typeof shiftTimeInDayLabels].label as any)}
                        </StyledText>
                        &nbsp;{t('of_label')} {formattedShortMonth(date)}
                    </StyledText>
                </View> : null}
                <TouchableOpacity
                    disabled={!onClickRight}
                    style={{
                        padding: SPACE_VALUES.medium
                    }}
                    onPress={onClickRight}
                >
                    <LivoIcon name="chevron-right" size={24} color={onClickRight ? '#149EF2' : '#C6D0DB'} />
                </TouchableOpacity>
            </View>
        </View>
    )
}