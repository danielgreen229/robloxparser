import { Test, TestingModule } from '@nestjs/testing';
import { RobloxService } from './roblox.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse, AxiosHeaders } from 'axios';
import { GameInfo, RobloxGamesApiResponse, ThumbnailResponse } from './interfaces/game-info.interface';

describe('RobloxService', () => {
  let service: RobloxService;
  let httpService: HttpService;

  const mockGameInfo: GameInfo = {
    id: 67890,
    name: 'Test Game',
    description: 'Test Description',
    creator: {
      id: 123,
      name: 'Test Creator',
      type: 'User',
      isRNVAccount: false,
      hasVerifiedBadge: false,
    },
    price: 0,
    allowedGearGenres: [],
    genre: 'All',
    isGenreEnforced: false,
    copyable: false,
    playing: 100,
    visits: 1000,
    maxPlayers: 10,
    created: '2023-01-01T00:00:00Z',
    updated: '2023-01-02T00:00:00Z',
    studioAccessToApisAllowed: false,
    createVipServersAllowed: false,
    thumbnailUrl: 'test.jpg',
  };

  const createMockResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: new AxiosHeaders(),
    config: {
      headers: new AxiosHeaders(),
      url: '',
      method: 'get'
    }
  });

  const createMockError = (status: number): AxiosError => {
    const error = new AxiosError('Ошибка API');
    error.response = {
      status,
      statusText: 'Ошибка',
      data: { message: 'Произошла ошибка' },
      headers: {},
      config: { headers: new AxiosHeaders() }
    };
    return error;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RobloxService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            axiosRef: {
              interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() }
              }
            }
          }
        }
      ],
    }).compile();

    service = module.get<RobloxService>(RobloxService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен быть определен', () => {
    expect(service).toBeDefined();
  });

  describe('extractPlaceId', () => {
    it('должен извлекать placeId из валидного URL', () => {
      const urls = [
        'https://www.roblox.com/games/12345/Game-Name',
        'http://roblox.com/games/54321/Another-Game',
        'www.roblox.com/games/98765/Game-Name',
      ];

      urls.forEach(url => {
        const result = (service as any).extractPlaceId(url);
        expect(result).toMatch(/\d+/);
      });
    });

    it('должен возвращать null для невалидного URL', () => {
      const urls = [
        'invalid-url',
        'https://www.roblox.com/users/12345/profile',
        'https://roblox.com/games/not-a-number',
      ];

      urls.forEach(url => {
        const result = (service as any).extractPlaceId(url);
        expect(result).toBeNull();
      });
    });
  });

  describe('getUniverseId', () => {
    it('должен возвращать universeId для валидного placeId', async () => {
      const mockResponse = createMockResponse({ universeId: 67890 });
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await (service as any).getUniverseId('12345');
      expect(result).toBe('67890');
      expect(httpService.get).toHaveBeenCalledWith(
        'https://apis.roblox.com/universes/v1/places/12345/universe'
      );
    });

    it('должен возвращать null, если universeId отсутствует в ответе', async () => {
      const mockResponse = createMockResponse({});
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await (service as any).getUniverseId('12345');
      expect(result).toBeNull();
    });

    it('должен возвращать null при ошибке API', async () => {
      const error = createMockError(500);
      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

      const result = await (service as any).getUniverseId('12345');
      expect(result).toBeNull();
    });
  });

  describe('fetchGameInfo', () => {
    it('должен возвращать информацию об игре для валидного universeId', async () => {
      const mockApiResponse: RobloxGamesApiResponse = { 
        data: [{
          id: 67890,
          rootPlaceId: 12345,
          name: 'Test Game',
          description: 'Test Description',
          sourceName: '',
          sourceDescription: '',
          creator: {
            id: 123,
            name: 'Test Creator',
            type: 'User',
            isRNVAccount: false,
            hasVerifiedBadge: false,
          },
          price: 0,
          allowedGearGenres: [],
          genre: 'All',
          isGenreEnforced: false,
          copyable: false,
          playing: 100,
          visits: 1000,
          maxPlayers: 10,
          created: '2023-01-01T00:00:00Z',
          updated: '2023-01-02T00:00:00Z',
          studioAccessToApisAllowed: false,
          createVipServersAllowed: false,
        }] 
      };

      const mockResponse = createMockResponse(mockApiResponse);
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await (service as any).fetchGameInfo('67890');
      expect(result).toEqual(mockApiResponse.data[0]);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://games.roproxy.com/v1/games?universeIds=67890'
      );
    });

    it('должен возвращать null, если данные об игре отсутствуют', async () => {
      const mockApiResponse: RobloxGamesApiResponse = { data: [] };
      const mockResponse = createMockResponse(mockApiResponse);
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await (service as any).fetchGameInfo('67890');
      expect(result).toBeNull();
    });

    it('должен возвращать null при ошибке API', async () => {
      const error = createMockError(500);
      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

      const result = await (service as any).fetchGameInfo('67890');
      expect(result).toBeNull();
    });
  });

  describe('fetchGameThumbnail', () => {
    it('должен возвращать превью для валидного universeId', async () => {
      const mockApiResponse: ThumbnailResponse = { 
        data: [{
          targetId: 67890,
          state: 'Completed',
          imageUrl: 'test.jpg'
        }] 
      };
      const mockResponse = createMockResponse(mockApiResponse);
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await (service as any).fetchGameThumbnail('67890');
      expect(result?.imageUrl).toBe('test.jpg');
      expect(httpService.get).toHaveBeenCalledWith(
        'https://thumbnails.roproxy.com/v1/games/icons?universeIds=67890&size=512x512&format=Png&isCircular=false'
      );
    });

    it('должен возвращать null, если данные о превью отсутствуют', async () => {
      const mockApiResponse: ThumbnailResponse = { data: [] };
      const mockResponse = createMockResponse(mockApiResponse);
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await (service as any).fetchGameThumbnail('67890');
      expect(result).toBeNull();
    });

    it('должен возвращать null при ошибке API', async () => {
      const error = createMockError(500);
      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => error));

      const result = await (service as any).fetchGameThumbnail('67890');
      expect(result).toBeNull();
    });
  });

  describe('getGameInfoByUniverseId', () => {
    it('должен объединять информацию об игре и превью', async () => {
      jest.spyOn(service as any, 'fetchGameInfo').mockResolvedValue({
        ...mockGameInfo,
        thumbnailUrl: undefined,
      });
      jest.spyOn(service as any, 'fetchGameThumbnail').mockResolvedValue({
        imageUrl: 'test.jpg'
      });

      const result = await (service as any).getGameInfoByUniverseId('67890');
      expect(result).toEqual(mockGameInfo);
    });

    it('должен обрабатывать отсутствие превью', async () => {
      jest.spyOn(service as any, 'fetchGameInfo').mockResolvedValue({
        ...mockGameInfo,
        thumbnailUrl: undefined,
      });
      jest.spyOn(service as any, 'fetchGameThumbnail').mockResolvedValue(null);

      const result = await (service as any).getGameInfoByUniverseId('67890');
      expect(result).toEqual({
        ...mockGameInfo,
        thumbnailUrl: null,
      });
    });

    it('должен возвращать null, если информация об игре отсутствует', async () => {
      jest.spyOn(service as any, 'fetchGameInfo').mockResolvedValue(null);
      jest.spyOn(service as any, 'fetchGameThumbnail').mockResolvedValue({
        imageUrl: 'test.jpg'
      });

      const result = await (service as any).getGameInfoByUniverseId('67890');
      expect(result).toBeNull();
    });
  });

  describe('getGameInfo', () => {
    it('должен возвращать полную информацию об игре для валидного URL', async () => {
      jest.spyOn(service as any, 'extractPlaceId').mockReturnValue('12345');
      jest.spyOn(service as any, 'getUniverseId').mockResolvedValue('67890');
      jest.spyOn(service as any, 'getGameInfoByUniverseId').mockResolvedValue(mockGameInfo);

      const result = await service.getGameInfo('https://www.roblox.com/games/12345');
      expect(result).toEqual(mockGameInfo);
    });

    it('должен возвращать null для невалидного URL', async () => {
      jest.spyOn(service as any, 'extractPlaceId').mockReturnValue(null);
      
      const result = await service.getGameInfo('invalid-url');
      expect(result).toBeNull();
    });

    it('должен возвращать null, если universeId не может быть получен', async () => {
      jest.spyOn(service as any, 'extractPlaceId').mockReturnValue('12345');
      jest.spyOn(service as any, 'getUniverseId').mockResolvedValue(null);
      
      const result = await service.getGameInfo('https://www.roblox.com/games/12345');
      expect(result).toBeNull();
    });

    it('должен корректно обрабатывать ошибки', async () => {
      jest.spyOn(service as any, 'extractPlaceId').mockImplementation(() => {
        throw new Error('Тестовая ошибка');
      });
      
      const result = await service.getGameInfo('https://www.roblox.com/games/12345');
      expect(result).toBeNull();
    });
  });
});