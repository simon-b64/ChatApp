import {MessageType} from '../enums/messageType';

export interface MessageDto {
    content: string;
    username: string;
    timestamp: string;
    type: MessageType;
}
