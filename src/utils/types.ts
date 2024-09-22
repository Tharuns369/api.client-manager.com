import { Client, ClientTable, NewClient } from "../schemas/clients";
import { InvoiceFile, InvoiceFileTable, NewInvoiceFile } from "../schemas/invoicefiles";
import { Invoice, InvoiceTable, NewInvoice } from "../schemas/invoices";
import { NewClientService, ClientService, ClientServiceTable } from "../schemas/clientServices";
import { NewUser, User, UserTable } from "../schemas/users";
import { NewService, Service, ServiceTable } from "../schemas/services";

interface DbConfig {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
    ca: string;
}

interface Jwt {
    token_secret: string;
    token_life: number;
    refresh_token_secret: string;
    refresh_token_life: number;
}

interface S3 {
    access_key_id: string;
    secret_access_key: string;
    bucket_region: string;
    s3_bucket: string;

}

export interface Config {
    VERSION: string;
    DB: DbConfig;
    JWT: Jwt;
    S3: S3;
}

export type DbTable = UserTable | ClientTable | ClientServiceTable | InvoiceTable | InvoiceFileTable | ServiceTable;
export type NewDbRecord = NewUser | NewClient | NewClientService | NewInvoice | NewInvoiceFile | NewService;
export type DbRecord = User | Client | ClientService | Invoice | InvoiceFile | Service;
