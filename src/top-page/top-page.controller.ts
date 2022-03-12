import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_DELETED_MESSAGE, TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @Get('text-search')
  async textSearch(@Query() { text }: { text: string }): Promise<TopPageModel[]> {
    return this.topPageService.findByText(text);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Get('find')
  async find(@Query() dto: FindTopPageDto): Promise<TopPageModel[]> {
    return this.topPageService.findAllByCategory(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto): Promise<TopPageModel> {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id', IdValidationPipe) id: string): Promise<TopPageModel> {
    const foundTopPage = await this.topPageService.findById(id);

    if (!foundTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return foundTopPage;
  }

  @Get('by-alias/:alias')
  async getByAlias(@Param('alias') alias: string): Promise<TopPageModel> {
    const foundTopPageByAlias = await this.topPageService.findOneByAlias(alias);

    if (!foundTopPageByAlias) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return foundTopPageByAlias;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedTopPage = await this.topPageService.deletedById(id);

    if (!deletedTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return { message: TOP_PAGE_DELETED_MESSAGE };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ): Promise<TopPageModel> {
    const updatedTopPage = await this.topPageService.updateById(id, dto);

    if (!updatedTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return updatedTopPage;
  }
}
