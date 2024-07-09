import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from "node:fs"
import { join } from 'node:path';
import { lastValueFrom } from 'rxjs';

const MEMO_DATA_PATH = join(__dirname, "./../data/memoData.json");

@Injectable()
export class AppService {

  constructor(private readonly httpService: HttpService) { }

  //Memo Services

  createMemo(userName: string, memoName: string, memoContent: string) {
    const memoData = readFileSync(MEMO_DATA_PATH);
    const memoDataJSON = JSON.parse(memoData.toString());
    if (!memoDataJSON[userName]) {
      memoDataJSON[userName] = {};
    }
    memoDataJSON[userName][memoName] = memoContent;
    writeFileSync(MEMO_DATA_PATH, JSON.stringify(memoDataJSON));
    return memoDataJSON[userName][memoName];
  }

  getAllMemos(userName: string) {
    const memoData = readFileSync(MEMO_DATA_PATH);
    const memoDataJSON = JSON.parse(memoData.toString());
    if (!memoDataJSON[userName]) return [];
    return Object.keys(memoDataJSON[userName]);
  }

  getMemo(userName: string, memoName: string) {
    const memoData = readFileSync(MEMO_DATA_PATH);
    const memoDataJSON = JSON.parse(memoData.toString());
    if (!memoDataJSON[userName] || !memoDataJSON[userName][memoName]) return null;
    return memoDataJSON[userName][memoName];
  }

  async getRandomArticle() {
    const resp = (await lastValueFrom(
      this.httpService.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&generator=random&grnnamespace=0&grnlimit=1`)
    )).data;
    const page = resp.query.pages;
    const pageId = Object.keys(page)[0];
    return page[pageId].extract;
  }

  async getArticle(articleName: string) {
    const resp = (await lastValueFrom(
      this.httpService.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles=${articleName}`)
    )).data;
    const page = resp.query.pages;
    const pageId = Object.keys(page)[0];
    if (pageId === "-1") {
      return "Not Found";
    }
    return page[pageId].extract;
  }
}
