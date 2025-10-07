import { View } from "react-native";
import StyledText from "../StyledText";
import React from "react";
import CommonButton from "../buttons/CommonButton";
import { typographyStyles } from "../../styles/livoFonts";
import { WHITE } from "../../styles/colors";
;

interface BottomModalContentProps {
    title: string;
    subTitle: string;
    buttonTitle: string;
    icon: React.ReactNode | null;
    onPress: () => void;
    children?: React.ReactNode;
    style?: any;
    undoAction?: () => void;
    undoTitle?: string;
    iconBackGroundColor?: string;
}
export const BottomModalContent: React.FC<BottomModalContentProps> = ({
    title,
    subTitle,
    buttonTitle,
    icon,
    children,
    style,
    onPress,
    undoAction,
    undoTitle,
    iconBackGroundColor,
    ...props
}) => {

    return (
        <>
            {icon !== null ? <View
                style={{
                    paddingVertical: 16
                }}>
                <View
                    style={{
                        padding: 16,
                        borderRadius: 100,
                        backgroundColor: iconBackGroundColor || '#BAE3FE', // Action-Subtle
                        alignSelf: 'center'
                    }}>
                    {icon}
                </View>
            </View> : null}
            <View>
                {title.length > 0 ? <StyledText /* Label/X Large */
                    style={{
                        ...typographyStyles.heading.medium,
                        marginBottom: 12,
                        textAlign: 'left',
                        marginTop: 12
                    }}>
                    {title}
                </StyledText> : null}
                <StyledText /* Parragraph/Medium */
                    style={{
                        ...typographyStyles.body.regular,
                        textAlign: 'left',
                        marginBottom: 12
                    }}>
                    {subTitle}
                </StyledText>
            </View>
            {children}
            <View
                style={{
                    width: '100%',
                }}
            >
                <CommonButton
                    undoTitle={undoTitle}
                    undoAction={undoAction}
                    title={buttonTitle}
                    onPress={onPress}
                    color={WHITE}
                    borderColor='#149EF2'
                    backgroundColor='#149EF2'
                    style={{
                        marginTop: 12,
                        marginBottom: 12
                    }}
                />
            </View>
        </>

    );
}