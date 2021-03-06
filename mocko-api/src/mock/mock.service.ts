import {Injectable} from '@nestjs/common';
import {Mock} from "./data/mock.entity";
import {CreateMockRequestDto} from "./data/create-mock-request.dto";
import {MockRepository} from "./mock.repository";
import {MockOptions} from "./data/mock-options.entity";
import {RedisProvider} from "../redis/redis.provider";
import {DEPLOY_CHANNEL} from "./mock.constants";

@Injectable()
export class MockService {
    constructor(
        private readonly repository: MockRepository,
        private readonly redisProvider: RedisProvider,
    ) { }

    async listAll(): Promise<Mock[]> {
        return this.repository.listMocks();
    }

    async create(request: CreateMockRequestDto): Promise<void> {
        const mock = Mock.ofDto(request);
        await this.repository.createMock(mock);
        await this.deploy();
    }

    async deleteOne(id: string): Promise<void> {
        await this.repository.deleteMock(id);
        await this.deploy();
    }

    private async deploy() {
        const mocks = await this.listAll();
        const options = new MockOptions(mocks);

        await this.repository.setOptions(options);
        await this.redisProvider.publish(DEPLOY_CHANNEL);
    }
}
