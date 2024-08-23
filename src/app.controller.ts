import {
  Controller,
  Get,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { trace } from '@opentelemetry/api';

@Controller()
export class AppController {
  @Get('/bad-request')
  badRequest(@Req() req: any) {
    const span = trace.getTracer('nestjs-service').startSpan('bad-request');

    const errorDetails = {
      type: 'Client Error',
      message: 'The client request was invalid.',
      details: 'Details about the bad request.',
      authenticated: req.isAuthenticated
        ? 'Authenticated user'
        : 'Unauthenticated user',
    };

    // Serialize the object to a JSON string
    span.setAttribute('error.info', JSON.stringify(errorDetails));

    span.setStatus({ code: 2, message: 'Bad Request' });
    span.end();

    throw new HttpException('Bad request!', HttpStatus.BAD_REQUEST);
  }

  @Get('/server-error')
  serverError(@Req() req: any) {
    const span = trace.getTracer('nestjs-service').startSpan('server-error');

    const errorDetails = {
      type: 'Server Error',
      message: 'An internal server error occurred.',
      details: 'Details about the server error.',
      authenticated: req.isAuthenticated
        ? 'Authenticated user'
        : 'Unauthenticated user',
    };

    // Serialize the object to a JSON string
    span.setAttribute('error.info', JSON.stringify(errorDetails));

    span.setStatus({ code: 2, message: 'Internal Server Error' });
    span.end();

    throw new HttpException(
      'Internal server error!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
