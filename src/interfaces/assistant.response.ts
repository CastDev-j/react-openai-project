export interface QuestionResponse {
    messages: Message[];
}

export interface Message {
    role:    Role;
    content: string[];
}

export enum Role {
    Assistant = "assistant",
    User = "user",
}
