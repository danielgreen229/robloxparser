import { IsArray, IsString, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class GameUrlDto {
  @IsString({ message: 'URL должен быть строкой' })
  @Matches(
    /^(https?:\/\/)?(www\.)?roblox\.com\/games\/\d+/i,
    {
      message: 'Некорректная ссылка на игру Roblox. Пример: https://www.roblox.com/games/123456789'
    }
  )
  url: string;
}

export class GameRequestDto {
  @IsArray({ message: 'Необходим массив игр' })
  @ValidateNested({ each: true, message: 'Каждый элемент массива должен быть объектом с URL' })
  @Type(() => GameUrlDto)
  games: GameUrlDto[];
}