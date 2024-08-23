import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { trace } from '@opentelemetry/api';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const span = trace
      .getTracer('nestjs-service')
      .startSpan(`${req.method} ${req.url}`);

    const token = req.headers['authorization'];

    if (token) {
      // Mock authentication logic, replace this with your actual token verification logic
      if (token === 'valid-token') {
        req.isAuthenticated = true;
        span.setAttribute('user.authenticated', true);
      } else {
        req.isAuthenticated = false;
        span.setAttribute('user.authenticated', false);
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      req.isAuthenticated = false;
      span.setAttribute('user.authenticated', false);
    }

    res.on('finish', () => {
      if (res.statusCode >= 400) {
        span.setAttribute('error', true);
        span.setAttribute('http.status_code', res.statusCode);
      }
      span.end();
    });

    next();
  }
}
