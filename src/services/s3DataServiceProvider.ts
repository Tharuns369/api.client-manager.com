import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigData } from '../config/appConfig';

interface Config {
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    },
    region: string,
    s3_bucket: string,
    expires: number,
    useAccelerateEndpoint?: boolean;
}

export class S3FileService {

    config: Config;
    s3Client: S3Client;
    constructor() {
        this.config = {
            credentials: {
                accessKeyId: ConfigData.S3.access_key_id,
                secretAccessKey: ConfigData.S3.secret_access_key
            },
            region: ConfigData.S3.bucket_region,
            s3_bucket: ConfigData.S3.s3_bucket,
            expires: 3600
        };
        this.s3Client = new S3Client(this.config);
    }

    // Generate presigned URL for file upload
    public async generatePresignedUrl(fileName: string, type = "put", slug?: string, contentType?: string, isPublic = false, expireSeconds = this.config.expires, bucket = this.config.s3_bucket) {
        try {

            const key = await this.prepareKey(fileName, slug);

            const params: any = {
                Bucket: bucket,
                Key: key
            };

            if (isPublic) {
                params["ACL"] = 'public-read';
            }

            if (contentType) {
                params["ContentType"] = contentType;
            }

            else {
                if (type == "put") {
                    params["ContentType"] = 'application/x-www-form-urlencoded';
                }
            }

            const command = type === "put" ? new PutObjectCommand(params) : new GetObjectCommand(params);

            const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: expireSeconds });

            return signedUrl;
        } catch (err) {
            console.log(err);
            return null;
        }
    }


    async prepareKey(fileName: string, slug?: string) {

        let key = "";

        if (slug) {
            key += `${slug}/`;
        }

        key += fileName;


        return key;
    }


}

