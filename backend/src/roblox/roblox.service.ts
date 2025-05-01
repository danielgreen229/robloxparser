import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class RobloxService {
  private readonly logger = new Logger(RobloxService.name);
  private readonly ROBLOX_PLACE_API = 'https://apis.roblox.com/universes/v1/places';
  private readonly ROBLOX_GAMES_API = 'https://games.roproxy.com/v1/games';
  private readonly ROBLOX_THUMBNAIL_API = 'https://thumbnails.roproxy.com/v1/games/icons';

  constructor(private readonly httpService: HttpService) {}

  async getGameInfo(gameUrl: string): Promise<any> {
    try {
      const placeId = this.extractPlaceId(gameUrl);
      if (!placeId) {
        this.logger.warn(`Invalid game URL format: ${gameUrl}`);
        return null;
      }

      const universeId = await this.getUniverseId(placeId);
      if (!universeId) {
        this.logger.warn(`Failed to get universeId for place: ${placeId}`);
        return null;
      }

      return await this.getGameInfoByUniverseId(universeId);
    } catch (error) {
      this.logError(error, `Failed to process game URL: ${gameUrl}`);
      return null;
    }
  }

  private extractPlaceId(input: string): string | null {
    const match = input.match(/roblox\.com\/games\/(\d+)/i);
    return match?.[1] ?? null;
  }

  private async getUniverseId(placeId: string): Promise<string | null> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{ universeId: number }>(
          `${this.ROBLOX_PLACE_API}/${placeId}/universe`
        )
      );
      return data.universeId?.toString() ?? null;
    } catch (error) {
      this.logError(error, `getUniverseId failed for place: ${placeId}`);
      return null;
    }
  }

  private async getGameInfoByUniverseId(universeId: string): Promise<any> {
    try {
      const [gameInfo, thumbnail] = await Promise.all([
        this.fetchGameInfo(universeId),
        this.fetchGameThumbnail(universeId),
      ]);

      if (!gameInfo) {
        this.logger.warn(`No game info found for universe: ${universeId}`);
        return null;
      }

      return {
        ...gameInfo,
        thumbnailUrl: thumbnail?.imageUrl || null,
      };
    } catch (error) {
      this.logError(error, `getGameInfoByUniverseId failed for universe: ${universeId}`);
      return null;
    }
  }

  private async fetchGameInfo(universeId: string): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{ data: any[] }>(
          `${this.ROBLOX_GAMES_API}?universeIds=${universeId}`
        )
      );
      return data.data?.[0] ?? null;
    } catch (error) {
      this.logError(error, `fetchGameInfo failed for universe: ${universeId}`);
      return null;
    }
  }

  private async fetchGameThumbnail(universeId: string): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{ data: { imageUrl: string }[] }>(
          `${this.ROBLOX_THUMBNAIL_API}?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`
        )
      );
      return data.data?.[0] ?? null;
    } catch (error) {
      this.logError(error, `fetchGameThumbnail failed for universe: ${universeId}`);
      return null;
    }
  }

  private logError(error: unknown, context: string): void {
    if (error instanceof AxiosError) {
      this.logger.error(`${context} | Status: ${error.response?.status} | Data: ${JSON.stringify(error.response?.data)}`);
    } else if (error instanceof Error) {
      this.logger.error(`${context} | Error: ${error.message}`, error.stack);
    } else {
      this.logger.error(context);
    }
  }
}