import { ChatKitty } from "@chatkitty/core";

export const chatkitty = ChatKitty.getInstance(
  "5969eb82-f10a-4f2b-9ee3-d175e3c77e3e"
);

const mapUser = (user) => ({
  _id: user.name,
  username: user.displayName,
  avatar: user.displayPictureUrl,
  status: {
    state: user.presence.online ? "online" : "offline",
  },
  _user: user,
});

const mapMessage = (message, timeFormat) => ({
  _id: message.id,
  content:
    message.type === "TEXT" || message.type === "SYSTEM_TEXT"
      ? message.body
      : undefined,
  senderId:
    message.type === "TEXT" || message.type === "FILE"
      ? message.user.name
      : "system",
  username:
    message.type === "TEXT" || message.type === "FILE"
      ? message.user.displayName
      : "System",
  timestamp: parseTimestamp(message.createdTime, timeFormat || "HH:mm"),
  date: parseTimestamp(message.createdTime, "DD MMMM YYYY"),
  _message: message,
});

const mapChannel = async (user, channel) => ({
  roomId: channel.id,
  roomName:
    channel.type === "DIRECT"
      ? channel.members
          .filter((member) => member.id !== user.id)
          .map((member) => member.displayName)
          .join(", ")
      : channel.name,
  users:
    channel.type === "DIRECT"
      ? channel.members.map((member) => mapUser(member))
      : await (async () => {
          const result = await chatkitty.listChannelMembers({ channel });
          if (result.succeeded) {
            return result.paginator.items.map((member) => mapUser(member));
          }
          return [];
        })(),
  lastMessage:
    channel.lastReceivedMessage &&
    mapMessage(channel.lastReceivedMessage, "DD MMMM, HH:mm"),
  _channel: channel,
  _messages_paginator: null,
  _chat_session: null,
});

export const login = async (username) => {
  await chatkitty.startSession({ username });
};

export const enterRoom = async ({ room, onMessageReceived, onRoomUpdated }) => {
  const result = await chatkitty.startChatSession({
    channel: room._channel,
    onMessageReceived: (message) => {
      const mapped = mapMessage(message);

      room.lastMessage = mapped;

      onMessageReceived(mapped);
      onRoomUpdated(room);
    },
  });

  if (result.succeeded) {
    room._chat_session = result.session;
  }
};

export const exitRoom = (room) => {
  room._chat_session?.end?.();
  room._messages_paginator = null;
  room._chat_session = null;
};

export const fetchMessages = async (room) => {
  if (room._messages_paginator) {
    const items = room._messages_paginator.items
      .map((message) => mapMessage(message))
      .reverse();
    const hasMore = room._messages_paginator.hasNextPage;
    if (hasMore) {
      room._messages_paginator = await room._messages_paginator.nextPage();
    }
    return { items, hasMore };
  }
  const result = await chatkitty.listMessages({ channel: room._channel });
  if (result.succeeded) {
    const items = result.paginator.items
      .map((message) => mapMessage(message))
      .reverse();
    const hasMore = result.paginator.hasNextPage;
    if (hasMore) {
      room._messages_paginator = await result.paginator.nextPage();
    }
    return { items, hasMore };
  }
  return { items: [], hasMore: false };
};

export const fetchRooms = async () => {
  const user = chatkitty.currentUser;

  if (!user) {
    return [];
  }

  const result = await chatkitty.listChannels({ filter: { joined: true } });
  if (result.succeeded) {
    return await Promise.all(
      result.paginator.items.map(
        async (channel) => await mapChannel(user, channel)
      )
    );
  }
  return [];
};

export const sendMessage = async ({ room, content }) => {
  if (content) {
    await chatkitty.sendMessage({ channel: room._channel, body: content });
  }
};

export const logout = async () => {
  await chatkitty.endSession();
};
