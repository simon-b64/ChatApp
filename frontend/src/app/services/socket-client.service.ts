import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, filter, first, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {SocketClientState} from '../enums/SocketClientState';
import {Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';


@Injectable({
    providedIn: 'root'
})
export class SocketClientService implements OnDestroy {
    private readonly client: Client;
    private readonly state$ = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    private readonly destroy$ = new Subject<void>();

    constructor() {
        this.client = new Client({
            webSocketFactory: () => new SockJS('https://chat-app.avox.at/chat-api/v1/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log(str),
            onConnect: () => this.state$.next(SocketClientState.CONNECTED),
            onDisconnect: () => this.state$.next(SocketClientState.ATTEMPTING),
        });

        this.client.activate();
    }

    private connect(): Observable<Client> {
        return new Observable<Client>(observer => {
            this.state$.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
                observer.next(this.client);
            });
        });
    }

    public onMessage<T>(topic: string, handler = SocketClientService.jsonHandler<T>): Observable<T> {
        return this.connect().pipe(first(), switchMap(client => {
            return new Observable<T>((observer) => {
                const subscription = client.subscribe(topic, (message: IMessage) => {
                    observer.next(handler(message));
                });

                return () => {
                    subscription.unsubscribe();
                };
            }).pipe(takeUntil(this.destroy$));
        }));
    }

    public onPlainMessage(topic: string): Observable<string> {
        return this.onMessage<string>(topic, SocketClientService.textHandler);
    }

    public send(destination: string, payload: object): void {
        this.connect()
            .pipe(first())
            .subscribe(client => client.publish({
                destination,
                body: JSON.stringify(payload),
            }));
    }

    ngOnDestroy() {
        this.disconnect().then();
    }

    public async disconnect(): Promise<void> {
        await this.client.deactivate();
        this.state$.next(SocketClientState.DISCONNECTED)
        this.destroy$.next();
        this.destroy$.complete();
    }


    static jsonHandler<T>(message: IMessage): T {
        return JSON.parse(message.body);
    }

    static textHandler(message: IMessage): string {
        return message.body;
    }

}
