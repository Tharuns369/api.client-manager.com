interface DbConfig {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
    ca: string;
}


export interface Config {
    VERSION: string;
    DB: DbConfig;
}