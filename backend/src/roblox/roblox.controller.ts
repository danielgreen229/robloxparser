import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RobloxService } from './roblox.service';
import { GameRequestDto } from './dto/game-request.dto';

@Controller('games')
export class RobloxController {
    constructor(private readonly robloxService: RobloxService) {}

    @Post('info')
    async getGamesInfo(@Body() gameRequest: GameRequestDto) {
      if (!gameRequest?.games?.length) {
        throw new HttpException('Не предоставлены ссылки на игры', HttpStatus.BAD_REQUEST);
      }

      const results = await Promise.all(
        gameRequest.games.map(({ url }) => this.robloxService.getGameInfo(url))
      );

      const validResults = results.filter(result => result !== null);
      const invalidUrls = gameRequest.games
        .map(({ url }) => url)
        .filter((_, index) => results[index] === null);

      return {
        success: validResults.length > 0,
        games: validResults,
        invalidUrls,
        message: invalidUrls.length > 0
          ? `Успешно получена информация для ${validResults.length} игр. Не удалось обработать ${invalidUrls.length} ссылок`
          : 'Информация по всем играм успешно получена',
      };
    }
}