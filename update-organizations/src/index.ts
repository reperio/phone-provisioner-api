import {UnitOfWork} from '../../db';
import {Logger, transports} from 'winston';
import 'winston-daily-rotate-file';
import KazooService from '../../kazoo'

const logger = new Logger({
    transports: [
        new transports.Console({
            prepend: true,
            level: 'debug',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new transports.DailyRotateFile({
            filename: `./logs/%DATE%.app.log`,
            createTree: true,
            prepend: true,
            level: 'debug',
            humanReadableUnhandledException: true,
            handleExceptions: true,
            json: true
        })
    ]
});

async function syncOrganizations() : Promise<void> {
    const uow = new UnitOfWork(logger);

    try {
        const cachedOrganizations = await uow.organizationRepository.getOrganizations();
        const kazooService = new KazooService(logger);
        logger.info('Renewing API auth');
        await kazooService.authenticate(process.env.CREDENTIALS, process.env.ACCOUNT_NAME);
        logger.info('Fetching new organizations');
        const organizations = await kazooService.getOrganizations(process.env.ACCOUNT_ID);

        await uow.beginTransaction();

        logger.info('Removing old organizations from the database');
        await uow.organizationRepository.disableOldOrganizations(
            cachedOrganizations
                .filter((org: any) => organizations.findIndex((o: any) => o.id == org.id) < 0)
                .map((org: any) => org.id)
        );

        logger.info('Adding new organizations to the database');
        for(let i = 0; i < organizations.length; i++) {
            const org = organizations[i];
            await uow.organizationRepository.addOrganization(org.id, org.name, org.realm);
        }

        await uow.commitTransaction();

        logger.info('Finished syncing organizations');
    } catch(e) {
        logger.error('Failed to update organizations');
        logger.error(e);
        await uow.rollbackTransaction();
    }

    process.exit();
}

syncOrganizations();