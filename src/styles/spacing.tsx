enum SpaceEnum {
    s00 = 0,
    s01 = 1,
    s02 = 2,
    s04 = 4,
    s06 = 6,
    s08 = 8,
    s12 = 12,
    s16 = 16,
    s24 = 24,
    s32 = 32,
    s40 = 40,
    s48 = 48,
    s56 = 56,
    s64 = 64,
}

export const SPACE_VALUES = {
    none: SpaceEnum.s00,
    tiny: SpaceEnum.s04,
    small: SpaceEnum.s08,
    medium: SpaceEnum.s12,
    large: SpaceEnum.s16,
    xLarge: SpaceEnum.s24,
    huge: SpaceEnum.s32,
}

export const BORDER = {
    none: SpaceEnum.s00,
    small: SpaceEnum.s01,
    medium: SpaceEnum.s02,
    large: SpaceEnum.s04,
}