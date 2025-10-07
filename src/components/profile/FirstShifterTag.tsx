import { View } from "react-native";
import StyledText from "../StyledText";
import { typographyStyles } from "../../styles/livoFonts";

export const FirstShifterTag = () => (
    <View
        style={{
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 6,
            backgroundColor: '#7E58C2' // Content-Content-Bonus-Regular
        }}>
        <StyledText style={{ // TODO Locales
            ...typographyStyles.body.small,
            color: '#FFF', //Text-Inverse
        }}>
            Primer turno
        </StyledText>
    </View>
)