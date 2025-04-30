// src/roblox/interfaces/game-info.interface.ts

export interface CreatorInfo {
    id: number;
    name: string;
    type: 'User' | 'Group';
    isRNVAccount: boolean;
    hasVerifiedBadge: boolean;
}

export interface RobloxGamesApiResponse {
    data: RobloxGameResponse[];
}

export interface RobloxGameResponse {
    id: number;
    rootPlaceId: number;
    name: string;
    description: string;
    sourceName: string;
    sourceDescription: string;
    creator: CreatorInfo;
    price: number;
    allowedGearGenres: string[];
    genre: string;
    isGenreEnforced: boolean;
    copyable: boolean;
    playing: number;
    visits: number;
    maxPlayers: number;
    created: string;
    updated: string;
    studioAccessToApisAllowed: boolean;
    createVipServersAllowed: boolean;
}

export interface GameInfo extends Omit<RobloxGameResponse, 'rootPlaceId' | 'sourceName' | 'sourceDescription'> {
    thumbnailUrl: string | null;
}

export interface ThumbnailResponse {
    data: {
        targetId: number;
        state: string;
        imageUrl: string;
    }[];
}