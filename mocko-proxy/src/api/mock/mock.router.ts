import {IRouter} from "../../utils/router";
import {Provider} from "../../utils/decorators/provider";
import {MockService} from "./mock.service";

@Provider()
export class MockRouter implements IRouter {
    constructor(
        private readonly service: MockService,
    ) { }

    getRoutes() {
        return this.service.getRoutes();
    }
}
