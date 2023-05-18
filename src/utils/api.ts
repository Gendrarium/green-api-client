const BASE_URL = 'https://api.green-api.com';

export const sendMessage = ({
  idInstance,
  apiTokenInstance,
  chatId,
  message,
}: {
  idInstance: string;
  apiTokenInstance: string;
  chatId: string;
  message: string;
}): Promise<any> => {
  return fetch(
    `${BASE_URL}/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatId, message }),
    },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error('Ошибка');
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

export const receiveNotification = ({
  idInstance,
  apiTokenInstance,
}: {
  idInstance: string;
  apiTokenInstance: string;
}): Promise<any> => {
  return fetch(
    `${BASE_URL}/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then((res) => {
      if (res.status === 400) {
        throw new Error('Неверные idInstance или apiTokenInstance');
      }
      if (res.status === 200) {
        return res.json();
      }
      throw new Error('Неизвестная ошибка');
    })
    .catch((e) => {
      console.log(e);
    });
};

export const deleteNotification = ({
  idInstance,
  apiTokenInstance,
  receiptId,
}: {
  idInstance: string;
  apiTokenInstance: string;
  receiptId: string;
}): Promise<any> => {
  return fetch(
    `${BASE_URL}/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then((res) => {
      if (res.status === 400) {
        throw new Error('Неверные idInstance или apiTokenInstance');
      }
      if (res.status === 200) {
        return res.json();
      }
      throw new Error('Неизвестная ошибка');
    })
    .catch((e) => {
      console.log(e);
    });
};

export const getSettings = ({
  idInstance,
  apiTokenInstance,
}: {
  idInstance: string;
  apiTokenInstance: string;
}): Promise<any> => {
  return fetch(
    `${BASE_URL}/waInstance${idInstance}/GetSettings/${apiTokenInstance}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
    .then((res) => {
      if (res.status === 400) {
        throw new Error('Неверные idInstance или apiTokenInstance');
      }
      if (res.status === 200) {
        return res.json();
      }
      throw new Error('Неизвестная ошибка');
    })
    .catch((e) => {
      console.log(e);
    });
};

export const setSettings = ({
  idInstance,
  apiTokenInstance,
  incomingWebhook,
  outgoingWebhook,
}: {
  idInstance: string;
  apiTokenInstance: string;
  incomingWebhook: 'yes' | 'no';
  outgoingWebhook: 'yes' | 'no';
}): Promise<any> => {
  return fetch(
    `${BASE_URL}/waInstance${idInstance}/SetSettings/${apiTokenInstance}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ incomingWebhook, outgoingWebhook }),
    },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error('Ошибка');
      }
    })
    .catch((e) => {
      console.log(e);
    });
};
