import { useEffect, useState } from 'react';
import { createMessage, getMessages, client } from './services/client';
import './App.css';


function App() {

  const [messages, rawSetMessages] = useState(['wow']);
  const [userName, setUserName] = useState('');
  const [userNameInForm, setUserNameInForm] = useState('');
  const [messageInForm, setMessageInForm] = useState('');

  function setMessages(_messages) {
    console.log('setting', _messages);
    rawSetMessages(_messages);
  }

  async function handleSubmitMessage(e) {
    e.preventDefault();

    await createMessage(userName, messageInForm);
    setMessageInForm('');
  }

  function handleNameSubmit(e) {
    e.preventDefault();
    
    setUserName(userNameInForm);
  }

  async function load() {
    const data = await getMessages();

    setMessages(data);  
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line


  useEffect(() => {
    client
      .from('chat_messages')
      .on('*', async ({ new: { from, message } }) => {
        // this happens in response to a new message

        // pessimism: just refresh the whole page every time
        // await load();

        // optimistically just add the most recent message to the messages array
        if (from && message) {
          console.log('starting with', messages);
          console.log('and appending', { from, message });
          setMessages((oldMessages) => [...oldMessages, { from, message }]);
        }
      })
      .subscribe();

  }, []);
  
  return (
    <div className="App">
      {
        !userName ? <form onSubmit={handleNameSubmit}>
          <input onChange={e => setUserNameInForm(e.target.value)}/>
          <button>Submit Username</button>
        </form>
          : <header className="App-header">
            <h3>Hello {userName}</h3>
            <form onSubmit={handleSubmitMessage}>
              <input value={messageInForm} onChange={e => setMessageInForm(e.target.value)}/>
              <button>Chat</button>
            </form>
            {
              messages
                .map((message, i) => <p key={message.from + i + message.message}>
                  {message.from}: {message.message}
                </p>)
            }
          </header>
      }
    </div>
  );
}

export default App;
