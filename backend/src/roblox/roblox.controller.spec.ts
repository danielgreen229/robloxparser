import { Test, TestingModule } from '@nestjs/testing';
import { RobloxController } from './roblox.controller';
import { RobloxService } from './roblox.service';

describe('RobloxController', () => {
  let controller: RobloxController;
  const mockRobloxService = {
    getGameInfo: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RobloxController],
      providers: [
        {
          provide: RobloxService,
          useValue: mockRobloxService
        }
      ],
    }).compile();

    controller = module.get<RobloxController>(RobloxController);
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /games/info', () => {
    it('должен возвращать информацию об играх', async () => {
      mockRobloxService.getGameInfo.mockResolvedValue({ name: 'Test Game' });
      
      const result = await controller.getGamesInfo({
        games: [{ url: 'test-url' }]
      });
      
      expect(result).toBeDefined();
    });
  });
});