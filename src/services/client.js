import { createClient } from '@supabase/supabase-js';
export const client = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

export function checkError({ data, error }) {
  if (error) {
    throw error;
  }
  return data;
}


export async function createMessage(from, message) {
  const { body } = await client
    .from('chat_messages')
    .insert({ from, message })
    .single();

  return body;
}


export async function getMessages() {
  const { body } = await client
    .from('chat_messages')
    .select('*');

  return body;
}