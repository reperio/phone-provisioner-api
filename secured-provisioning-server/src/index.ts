import {UnitOfWork} from '../../db';
const Server = require('hapijs-starter');
import * as path from 'path';
import {Request} from 'hapi';
import {Config} from './config';

async function validate(request: Request, username: string, password: string, h: any) {
    return {
        isValid: true,
        credentials: {username, password}
    };
}

async function startServer() : Promise<void> {
    try {
        const server = new Server({authEnabled: false, port: Config.port});

        await server.registerExtension({
            type: 'onRequest',
            method: async (request: Request, h: any) => {
                request.app.uows = [];

                request.app.getNewUoW = async () => {
                    const uow = new UnitOfWork(server.app.logger);
                    request.app.uows.push(uow);
                    return uow;
                };

                return h.continue;
            }
        });

        await server.registerAdditionalPlugin(require('hapi-auth-basic'));
        server.strategy('provisioningAuth', 'basic', {validate, unauthorizedAttributes: {realm: 'Restricted'}});

        await server.startServer();
        await server.registerRoutesFromDirectory(path.resolve(__dirname, './api'));
    } catch(e) {
        console.log(e);
    }
}

startServer();