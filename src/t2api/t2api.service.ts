import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Office } from 'src/types/interfaces';

@Injectable()
export class T2apiService {
  // Метод для получения всех офисов
  async getAllOffices() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
      'https://nnov.t2.ru/api/offices/locations?tele2Store=true&filterByOrder=false&siteId=siteNNOV',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      },
    );

    const data: { data: Office[] } = await page.evaluate(() => {
      return fetch(
        'https://nnov.t2.ru/api/offices/locations?tele2Store=true&filterByOrder=false&siteId=siteNNOV',
      )
        .then((response) => response.json())
        .then((json: { data: Office[] }) => {
          return json;
        });
    });

    await browser.close();

    return data;
  }

  // Метод для получения офисов с фильтрацией по определенному фильтру
  async gelALlOfficesFilter(filter) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
      'https://nnov.t2.ru/api/offices/locations?tele2Store=true&filterByOrder=false&siteId=siteNNOV',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      },
    );

    const dat: { data: Office[] } = await page.evaluate(() => {
      return fetch(
        'https://nnov.t2.ru/api/offices/locations?tele2Store=true&filterByOrder=false&siteId=siteNNOV',
      )
        .then((response) => response.json())
        .then((json: { data: Office[] }) => {
          return json;
        });
    });

    await browser.close();

    // Фильтрует офисы по переданному фильтру, проверяя наличие нужного сервиса в офисах
    const data: Office[] = dat.data.filter((office) => {
      // Проверяет, содержит ли офис услугу с переданным id
      return office.services.some((service) => service.id === filter);
    });

    return data;
  }
}
