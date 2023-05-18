import React, {
  useState,
  memo,
  useEffect,
  useCallback,
  Fragment,
  useRef,
} from 'react';
import {
  selectApiTokenInstance,
  selectIdInstance,
} from '../../store/slices/user';
import { useAppSelector } from '../../store/store';
import {
  deleteNotification,
  receiveNotification,
  sendMessage,
} from '../../utils/api';

interface ChatProps {
  handleLogout: () => void;
}

type Message = {
  sender: string;
  message: string;
  timestamp: number;
};

type TChat = {
  recipient: string;
  messages: Message[];
};

const Chat: React.FC<ChatProps> = ({ handleLogout }) => {
  const [chats, setChats] = useState<TChat[]>([]);
  const idInstance = useAppSelector(selectIdInstance);
  const apiTokenInstance = useAppSelector(selectApiTokenInstance);
  const [openedChat, setOpenedChat] = useState<number | null>(null);
  const [isAddNumber, setIsAddNumber] = useState<boolean>(false);
  const [addNumber, setAddNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [checkNotification, setCheckNotification] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  //add chats from localStorage if exist
  useEffect(() => {
    const chatsFromLocalStorage = localStorage.getItem('chats');
    if (chatsFromLocalStorage) {
      setChats(JSON.parse(chatsFromLocalStorage));
    }
  }, []);

  //scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (openedChat !== null && divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [openedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, chats]);

  const handleSendMessage = useCallback(() => {
    if (openedChat !== null) {
      //sendMessage
      sendMessage({
        idInstance,
        apiTokenInstance,
        chatId: chats[openedChat].recipient + '@c.us',
        message,
      }).then((res) => {
        if (res) {
          //save message
          const newMessage: Message = {
            sender: 'me',
            message,
            timestamp: Date.now(),
          };
          setMessage('');
          setChats((prev) => {
            const prevChats = [...prev];
            prevChats[openedChat].messages.push(newMessage);
            localStorage.setItem('chats', JSON.stringify(prevChats));
            return prevChats;
          });
        } else {
          console.log('Ошибка');
        }
      });
    }
  }, [apiTokenInstance, chats, idInstance, message, openedChat]);

  useEffect(() => {
    const handleDeleteNotification = async (receiptId: string) => {
      const res = await deleteNotification({
        idInstance,
        apiTokenInstance,
        receiptId: receiptId,
      });

      if (res) {
        console.log(
          res.result
            ? 'Уведомление успешно удалено'
            : 'Ошибка удаления уведомления',
        );
      }
    };

    const asyncReceiveNotification = async () => {
      const res = await receiveNotification({ idInstance, apiTokenInstance });

      if (res) {
        if (res.body.typeWebhook === 'incomingMessageReceived') {
          console.log('только один раз за раз');
          //add message to chats
          const newMessage: Message = { sender: '', message: '', timestamp: 0 };
          newMessage.sender = res.body.senderData.chatId.split('@')[0];
          newMessage.message = res.body.messageData.textMessageData.textMessage;
          newMessage.timestamp = res.body.timestamp * 1000;
          setChats((prev) => {
            console.log('прошёл');
            const prevChats = [...prev];
            const chatIndex = prevChats.findIndex((i) => {
              return i.recipient === newMessage.sender;
            });
            if (chatIndex > -1) {
              prevChats[chatIndex].messages.push(newMessage);
            } else {
              const newChat: TChat = {
                recipient: newMessage.sender,
                messages: [newMessage],
              };
              prevChats.push(newChat);
            }
            //add to localStorage
            localStorage.setItem('chats', JSON.stringify(prevChats));
            return prevChats;
          });

          //deleteNotification
          await handleDeleteNotification(res.receiptId);
        } else {
          //deleteNotification
          await handleDeleteNotification(res.receiptId);
        }
      }
      setCheckNotification((prev) => !prev);
    };

    asyncReceiveNotification();
  }, [apiTokenInstance, idInstance, checkNotification]);

  const handleAddPhone = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (addNumber) {
        setChats((prev) => [...prev, { recipient: addNumber, messages: [] }]);
        setAddNumber('');
        setIsAddNumber(false);
      }
    },
    [addNumber],
  );

  return (
    <section className="chat">
      <div
        className={`chat__left-column${
          openedChat === null ? ' chat__left-column_full' : ''
        }`}
      >
        <header className="chat__title-container">
          <h1 className="chat__title">Green Api Client</h1>
          <button className="chat__button" onClick={handleLogout}>
            Выйти
          </button>
        </header>
        <div className="chat__contacts">
          {chats.map((i, id) => (
            <button
              className={`chat__contact${
                id === openedChat ? ' chat__contact_selected' : ''
              }`}
              key={id}
              onClick={() => {
                setOpenedChat(id);
              }}
            >
              <h2 className="chat__contact-title">{i.recipient}</h2>
            </button>
          ))}
          <form className="chat__add-form" onSubmit={handleAddPhone}>
            {isAddNumber && (
              <div className="chat__add-container">
                <button
                  className="chat__add-close"
                  onClick={setIsAddNumber.bind(null, false)}
                >
                  x
                </button>
                <input
                  className="chat__add-input"
                  name="add"
                  onChange={(e) => setAddNumber(e.target.value)}
                  value={addNumber}
                  placeholder="Введите номер"
                  pattern="\d+"
                />
              </div>
            )}
            <button
              className="chat__add-button"
              onClick={() => {
                if (!isAddNumber) {
                  setIsAddNumber(true);
                }
              }}
              type={isAddNumber ? 'submit' : 'button'}
            >
              Добавить номер
            </button>
          </form>
        </div>
      </div>
      <div
        className={`chat__right-column${
          openedChat !== null ? ' chat__right-column_full' : ''
        }`}
      >
        {openedChat !== null && (
          <>
            <header className="chat__title-container chat__title-container_with-border">
              <button
                className="chat__button chat__button_big"
                onClick={() => {
                  setMessage('');
                  setOpenedChat(null);
                }}
              >
                &larr; Назад
              </button>
              <h2 className="chat__title">{chats[openedChat].recipient}</h2>
            </header>
            <div className="chat__nothing" />
            <div className="chat__messages" ref={divRef}>
              {chats[openedChat].messages.map((i, id) => (
                <p
                  className={`chat__message${
                    i.sender === 'me' ? ' chat__message_right' : ''
                  }`}
                  key={id}
                >
                  {i.message.split('\n').map((item, id, arr) => (
                    <Fragment key={id}>
                      {item}
                      {arr[id + 1] !== undefined ? <br /> : <></>}
                    </Fragment>
                  ))}
                  <span
                    className={`chat__time${
                      i.sender === 'me' ? ' chat__time_right' : ''
                    }`}
                  >
                    {new Date(i.timestamp).toLocaleString('ru-ru', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false,
                    })}
                  </span>
                </p>
              ))}
            </div>
            <div className="chat__input-container">
              <textarea
                name="message"
                className="chat__message-input"
                placeholder="Введите текст"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                value={message || ''}
              ></textarea>
              <button className="chat__send-button" onClick={handleSendMessage}>
                &crarr;
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default memo(Chat);
