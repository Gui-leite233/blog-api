import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    
    let errorMessage: string | string[];
    let error: string;
    
    if (typeof errorResponse === 'object' && errorResponse !== null) {
      errorMessage = 'message' in errorResponse ? String(errorResponse['message']) : 'Internal server error';
      error = 'error' in errorResponse ? String(errorResponse['error']) : 'Error';
    } else {
      errorMessage = exception.message;
      error = 'Error';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message: errorMessage,
    });
  }
}