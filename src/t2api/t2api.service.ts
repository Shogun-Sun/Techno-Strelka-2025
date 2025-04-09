import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class T2apiService {
  async getAllOffices() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
      'https://msk.t2.ru/api/offices/locations?tele2Store=true&filterByOrder=false&siteId=siteMSK',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      },
    );

    const data = await page.evaluate(() => {
      return fetch(
        'https://msk.t2.ru/api/offices/locations?tele2Store=true&filterByOrder=false&siteId=siteMSK',
      )
        .then((response) => response.json())
        .then((json) => json);
    });

    await browser.close();

    return data;
  }

  async gelALlOfficesFilter(filter) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Переходим на нужный URL
    await page.goto(
      'https://msk.t2.ru/api/offices/locations?tele2Store=true&filterByOrder=false&siteId=siteMSK',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    // Получаем данные с API
    const dat = await page.evaluate(() => {
      return fetch(
        'https://msk.t2.ru/api/offices/locations?tele2Store=true&filterByOrder=false&siteId=siteMSK',
      )
        .then((response) => response.json())
        .then((json) => json);
    });

    await browser.close();

    // Фильтруем офисы по переданному фильтру
    const data = dat.data.filter((office) => {
      // Проверяем, есть ли в services искомая услуга
      return office.services.some((service) => service.id === filter);
    });

    return data;
  }
}
