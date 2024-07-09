import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  //Memo API

  @Get("/memo/:userName")
  getAllMemos(@Param('userName') userName: string) {
    return this.appService.getAllMemos(userName);
  }

  @Get("/memo/:userName/:memoName")
  getMemo(@Param('userName') userName: string, @Param('memoName') memoId: string) {
    return this.appService.getMemo(userName, memoId);
  }

  @Post("/memo/:userName")
  createMemo(@Param('userName') userName: string, @Body() body: any) {
    return this.appService.createMemo(userName, body.memoName, body.memoData);
  }

  //Wiki API
  @Get("/wiki/random")
  getRandomArticle() {
    return this.appService.getRandomArticle();
  }

  @Get("/wiki/:articleName")
  getArticle(@Param('articleName') articleName: string) {
    return this.appService.getArticle(articleName);
  }
}
