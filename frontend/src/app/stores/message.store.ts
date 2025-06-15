import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {MessageDto} from '../model/messageDto';

export const MessageStore = signalStore(
    {providedIn: 'root'},
    withState({
        messages: [] as MessageDto[],
    }),
    withMethods((store) => {
        return {
            appendMessage(message: MessageDto) {
                patchState(store, {messages: [...store.messages(), message]});
            }
        }
    })
)
