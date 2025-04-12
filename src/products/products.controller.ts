import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}
  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto);
  }
  @Get(':id')
  async findProductById(@Param('id') id: string) {
    // this is 1 way to do it
    // try {
    //   const product = await firstValueFrom(
    //     this.productsClients.send({ cmd: 'find_one_product' }, { id }),
    //   );
    //   return product
    // } catch (error) {
    //   throw new RpcException(error)
    // }

    // this is another one
    return this.client.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.client.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Patch()
  updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.client.send({ cmd: 'update_product' }, updateProductDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, createProductDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
