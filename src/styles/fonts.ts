import { StyleSheet } from "react-native"
import { PRIMARY_BLUE } from "./colors";

export const fontSize = {
    biggest: 24,
    bigger: 20,
    big: 18,
    medium: 16,
    small: 14,
    tiny: 12,
}

export const fontWeight = {
    regular: 'Roboto-Regular',
    bold: 'Roboto-Medium',
    italic: 'Roboto-Italic',
    light: 'Roboto-Light'
}

export enum LayoutTextEnum {
    screenTitle = 'screenTitle',
    header = 'header',
    subHeader = 'subHeader',
    body = 'body',
    caption = 'caption',
    button = 'button',
    link = 'link',
    custom = 'custom',
    headerSmall = 'headerSmall'
}

export const layoutTextStyles = StyleSheet.create({
    screenTitle: {
        fontSize: fontSize.biggest,
        fontFamily: fontWeight.bold,
    },
    header: {
        fontSize: fontSize.bigger,
        fontFamily: fontWeight.bold,
        lineHeight: 20
    },
    subHeader: {
        fontSize: fontSize.big,
        fontFamily: fontWeight.light,
        lineHeight: 24
    },
    headerSmall: {
        fontSize: fontSize.big,
        fontFamily: fontWeight.regular,
        lineHeight: 20
    },
    body: {
        fontSize: fontSize.medium,
        fontFamily: fontWeight.light,
        lineHeight: 25
    },
    caption: {
        fontSize: fontSize.tiny,
        fontFamily: fontWeight.bold
    },
    button: {
        fontSize: fontSize.medium,
        fontFamily: fontWeight.regular
    },
    link: {
        fontSize: fontSize.medium,
        fontFamily: fontWeight.regular,
        color: PRIMARY_BLUE,
    },
    custom: {}
});


