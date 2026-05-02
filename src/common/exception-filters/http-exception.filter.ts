import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // console.error(exception, 'exception...');
    // console.log('----------------------------------------');
    // console.error((<object>exception).constructor.name, 'class name...');

    let statusCode: number;
    let isArray: boolean = false;
    let errName: string;
    let message: string;
    let messages: Record<string, string>[] | undefined;

    console.log('exception...', exception);

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errName = exception.name;

      let errRes = exception.getResponse();
      // if (exception instanceof ThrottlerException) {
      //   errRes = 'Too many requests';
      // }
      if (typeof errRes === 'string') {
        message = errRes;
      } else {
        const errMessage = <string | string[]>errRes['message'];
        if (Array.isArray(errMessage)) {
          isArray = true;
          messages = [];
          for (const errMsg of errMessage) {
            const field = errMsg.split(' ')[0];
            messages.push({ field, message: errMsg });
          }
          if (messages.length) {
            message = messages[0].message;
          } else {
            message = 'Validation error';
          }
        } else {
          message = errMessage;
        }
      }
    } else if (
      exception instanceof QueryFailedError &&
      exception['code'] === '23505'
    ) {
      console.log('Inside QueryFailedError...', exception.message);
      statusCode = 409;
      errName = exception.name;
      let field = exception.message.split('constraint ')[1];
      if (field.includes('#')) {
        field = field.split('#')[1];
      }
      field = field.replace(/"/g, '').trim();
      message = `${field} already exists`;
    } else if (exception instanceof Error) {
      statusCode = 500;
      errName = exception.name;
      message = exception.message;
    } else {
      statusCode = 500;
      errName = 'Unknown';
      message = 'Internal server error';
    }

    response.status(statusCode).json({
      status: false,
      statusCode,
      errName,
      isArray,
      message,
      messages,
      path: request.url,
      timestamp: Date.now() / 1000,
    });
  }
}
