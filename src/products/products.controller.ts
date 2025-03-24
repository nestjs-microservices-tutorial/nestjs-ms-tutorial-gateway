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
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto, RpcCustomExceptionFilter } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClients: ClientProxy,
  ) {}
  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClients.send(
      { cmd: 'find_all_products' },
      paginationDto,
    );
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
    return this.productsClients.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsClients.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Patch()
  updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.productsClients
      .send({ cmd: 'update_product' }, updateProductDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClients
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
