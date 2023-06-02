import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

export interface ISmsProvider {
  send(number: string, message: string): Observable<AxiosResponse>;
}
