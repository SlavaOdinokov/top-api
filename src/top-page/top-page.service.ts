import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
  constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {}

  async findByText(text: string) {
    return this.topPageModel
      .find({
        $text: { $search: text, $caseSensitive: false },
      })
      .exec();
  }

  async findAllByCategory({ firstCategory }: FindTopPageDto): Promise<TopPageModel[]> {
    return this.topPageModel
      .aggregate([
        { $match: { firstCategory: Number(firstCategory) } },
        {
          $group: {
            _id: { secondCategory: '$secondCategory' },
            pages: { $push: { alias: '$alias', title: '$title' } },
          },
        },
      ])
      .exec();
  }

  async create(dto: CreateTopPageDto): Promise<TopPageModel> {
    return this.topPageModel.create(dto);
  }

  async findById(id: string): Promise<TopPageModel> {
    return this.topPageModel.findById(id).exec();
  }

  async findOneByAlias(alias: string): Promise<TopPageModel> {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async deletedById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto): Promise<TopPageModel> {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
