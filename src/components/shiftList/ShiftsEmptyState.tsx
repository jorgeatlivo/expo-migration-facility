import { View } from "react-native"
import StyledText from "../StyledText"
import { typographyStyles } from "../../styles/livoFonts"
import { SPACE_VALUES } from "../../styles/spacing";
interface ShiftsEmptyStateProps {
    title: string;
    subtitle: string;
}

export const ShiftsEmptyState: React.FC<ShiftsEmptyStateProps> = ({
    title,
    subtitle
}) => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: SPACE_VALUES.medium
            }}
        >
            <StyledText
                style={{
                    ...typographyStyles.heading.medium,
                    textAlign: 'center',
                    marginBottom: SPACE_VALUES.small
                }}
            >
                {title}
            </StyledText>
            <StyledText
                style={{
                    ...typographyStyles.body.regular,
                    textAlign: 'center'
                }}
            >
               {subtitle}
            </StyledText>
        </View>
    )
}