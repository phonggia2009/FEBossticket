export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}