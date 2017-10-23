declare module '@google-cloud/logging-winston' {
    import * as winston from "winston";
    function LoggingWinston(): winston.TransportInstance;
    export = LoggingWinston;
}
