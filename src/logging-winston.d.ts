declare module '@google-cloud/logging-winston' {
    import * as winston from "winston";
    const transport: winston.TransportInstance;
    export = transport;
}
