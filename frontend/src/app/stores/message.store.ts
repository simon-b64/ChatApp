import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

export interface Message {
    content: string;
    author: string;
    timestamp: Date;
}

export const MessageStore = signalStore(
    { providedIn: 'root' },
    withState({
        messages: [] as Message[],
    }),
    withMethods((store) => {
        return {
            appendMessage(message: Message) {
                patchState(store, { messages: [...store.messages(), message] });
            }
        }
    })
)
