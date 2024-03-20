import copy from 'copy-to-clipboard';

export interface ITrace {
    time: number;
    data: any;
}

const LOG_STORE: ITrace[] = [];

export class Logger {    

    public static getLogger = (limit: number) => {

        return new Logger(limit);
    }

    private limit?: number

    constructor(limit?: number) {
        this.limit = limit;
    }

    public log = (data: any) => {
        if(typeof this.limit === 'number') {

            if(this.limit < 1) {
                return;
            }


            LOG_STORE.push({
                time: new Date().getTime(),
                data: data,
            });

            this.limit--;

            return;
        }

        LOG_STORE.push({
            time: new Date().getTime(),
            data: data,
        });
    }

    public copyToClipboard = () => {
        const json = this.serialize();

        return copy(json);
    }

    public serialize = () => {
        return JSON.stringify(LOG_STORE);
    }
}

const logger = new Logger();

export { logger };