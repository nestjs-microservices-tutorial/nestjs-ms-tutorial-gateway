import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly authClient: ClientProxy) {}
  @Post('register')
  registerUser(@Body() regiisterUserDto: RegisterUserDto) {
    return this.authClient.send('auth.register.user', regiisterUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authClient.send('auth.login.user', loginUserDto);
  }
  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(@User() user: CurrentUser, @Token() token: string) {
    return this.authClient.send('auth.verify.user', token);
  }
}
