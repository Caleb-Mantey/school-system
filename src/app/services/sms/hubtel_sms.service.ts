import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ISmsProvider } from './ISmsProvider.interface';

@Injectable()
export class HubtelSmsService implements ISmsProvider {
  constructor(private httpService: HttpService) {}

  send(number: string, message: string): Observable<AxiosResponse> {
    const clientid = process.env.HubtelUsername;
    const clientsecret = process.env.HubtelPassword;
    const from = process.env.HubtelSenderID;

    return this.httpService.get('https://smsc.hubtel.com/v1/messages/send', {
      params: {
        clientid,
        clientsecret, //if you wish to send to multiple numbers at the sametime, use the comma delimiter e.g. 233242813656, 233242365878
        content: message,
        from,
        to: number,
      },
    });
  }
}
