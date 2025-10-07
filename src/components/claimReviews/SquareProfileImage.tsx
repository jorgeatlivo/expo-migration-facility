import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { RootState, ShiftModalityEnum } from "../../types";
import { useSelector } from "react-redux";
import { Avatar } from "../../assets/images/Avatar";
import { modalityTags } from "../../styles/utils";
import LivoIcon from "../../assets/icons/LivoIcon";
import { SPACE_VALUES } from "../../styles/spacing";


interface SquareProfilePictureProps {
    profilePictureUrl?: string;
    modality: ShiftModalityEnum | null;
    style?: any;
    size: number;
}

export const SquareProfilePicture: React.FC<SquareProfilePictureProps> = ({ profilePictureUrl, modality, size, style }) => {
    const { facilityProfile } = useSelector((state: RootState) => state.profileData);
    const iconSize = size / 3;
    const poolAndInternalOnboarded = facilityProfile?.livoPoolOnboarded && facilityProfile?.livoInternalOnboarded;

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.imageContainer, { width: size, height: size, marginRight: SPACE_VALUES.tiny }]}>
                {profilePictureUrl ? (
                    <Image
                        source={{ uri: profilePictureUrl }}
                        style={[styles.image, { width: size, height: size }]}
                    />
                ) : (
                    <Avatar size={size} />
                )}
            </View>
            {modality && poolAndInternalOnboarded && (
                <View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor: modalityTags[modality].backgroundColor,
                            borderRadius: 100,
                            bottom: - SPACE_VALUES.tiny,
                            left: size - SPACE_VALUES.tiny - iconSize,
                            borderWidth: 2,
                            borderColor: '#fff',
                        },
                    ]}
                >
                    <LivoIcon name={modalityTags[modality].icon} size={iconSize} color={modalityTags[modality].color} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    imageContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        borderRadius: 8,
        resizeMode: 'cover',
    },
    iconContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        borderWidth: 2,
        borderColor: 'white',
    },
});
