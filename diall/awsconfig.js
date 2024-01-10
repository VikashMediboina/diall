import S3Client  from "@aws-sdk/client-s3";







const client = new S3Client({
    // The AWS Region where the Amazon Simple Storage Service (Amazon S3) bucket will be created. Replace this with your Region.
    region:'us-east-2',
    credentials: {
        accessKeyId:'',
        secretAccessKey:'',
    },
  });
export default client
