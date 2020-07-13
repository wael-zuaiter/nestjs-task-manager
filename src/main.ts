import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  logger.verbose('*************** ENV Variables *************', JSON.stringify(process.env));

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Task Manager')
    .setDescription('Task Manager API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('explore', app, document);

  // if(process.env.NODE_ENV !== 'production') {
  //   app.enableCors();
  // }
  app.enableCors();
  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;

  await app.listen(port);
  logger.verbose(`App listining on port ${port}`)
}
bootstrap();
