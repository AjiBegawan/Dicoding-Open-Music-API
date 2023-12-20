
# OpenMusic API v3

This project implements the OpenMusic API v3 specification, which includes the following features:

1.  Exporting songs from a playlist: This feature allows users to export a playlist of songs to a JSON file, which can then be sent to a specified email address. The export process uses RabbitMQ as a message broker, and Nodemailer to send the email.
2.  Uploading album covers: This feature allows users to upload a cover image for an album. The image must be a valid image file with a maximum size of 512 KB. The image can be stored either in a local file system or in an Amazon S3 bucket.
3.  Liking and disliking albums: This feature allows users to indicate whether they like or dislike an album. The API tracks the number of likes for each album.
4.  Server-side caching: The API uses server-side caching to improve performance for the endpoint that returns the number of likes for an album. The cache is valid for 30 minutes, and it is refreshed whenever the number of likes for an album changes.
5.  Maintaining features from previous versions: The API maintains all of the features and criteria from OpenMusic API v2 and v1, including:
- Album management
- Song management
- User registration and authentication
- Playlist management
- Foreign key constraints
- Data validation
- Error handling
## Tech Stack

**Server:** Nodejs and Hapi

The project is built using the following technology stack:

- Backend : Node.js
- Database : PostgreSQL
- Message broker : RabbitMQ
## Run Locally

To get started with the application, clone the repository and install the dependencies:

```bash
git clone https://github.com/AjiBegawan/Dicoding-Open-Music-API.git

cd Dicoding-Open-Music-API

npm install 
```

Then, start testing the application with the following command:
```bash
  npm run start-dev
```


 ## Notes

The project uses the following environment variables:

- RABBITMQ_SERVER: The host address of the RabbitMQ server
- SMTP_USER: The username for the email server
- SMTP_PASSWORD: The password for the email server
- SMTP_HOST: The host address of the email server
- SMTP_PORT: The port number of the email server
- REDIS_SERVER: The host address of the Redis server (optional)

The project is designed to be scalable and extensible. For example, the caching implementation can be easily replaced with a different caching engine.
