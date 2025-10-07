import { View } from "react-native";
import LivoIcon from "../../assets/icons/LivoIcon";
import { typographyStyles } from "../../styles/livoFonts";
import { formatTime } from "../../utils/utils";
import StyledText from "../StyledText";

interface ScheduleComponentProps {
    startTime: string;
    finishTime: string;
    style?: any
}

export const ScheduleComponent: React.FC<ScheduleComponentProps> = ({
    startTime,
    finishTime,
    style
}) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                ...style
            }}
        >
            <StyledText
                style={{
                    ...typographyStyles.body.regular,
                }}
            >
                {formatTime(startTime)}
            </StyledText>
            <LivoIcon name='arrow-right' size={16} color='#C6D0DB' />
            <StyledText
             style={{
                ...typographyStyles.body.regular,
            }}
            >
                {formatTime(finishTime)}
            </StyledText>
        </View>
    )
}