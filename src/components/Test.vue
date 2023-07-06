<template>
  <div>
    <vue-advanced-chat
      height="calc(100vh)"
      :current-user-id="currentUserId"
      :rooms="JSON.stringify(rooms)"
      :room-id="rooms.roomId"
      :rooms-loaded="true"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      @send-message="sendMessage($event.detail[0])"
      @fetch-messages="fetchMessages($event.detail[0])"
      :single-room="false"
      :show-search="false"
      :show-add-room="false"
      :show-files="true"
      :show-audio="false"
      :show-emojis="true"
      :show-reaction-emojis="true"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { register } from "vue-advanced-chat";
import { db } from "src/boot/firebase";

register();

export default defineComponent({
  setup() {
    const currentUserId = ref("1234");
    const rooms = ref([
      {
        roomId: "1",
        roomName: "John Doe",
        avatar: "https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj",
        users: [
          {
            _id: "1234",
            username: "John Doe",
            avatar: "https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj",
            status: {
              state: "online",
              lastChanged: "14 July, 20:00",
            },
          },
          {
            _id: "4321",
            username: "John Snow",
            avatar: "https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj",
            status: {
              state: "online",
              lastChanged: "14 July, 20:00",
            },
          },
        ],
        // typingUsers: [4321],
        lastMessage: {
          _id: "xyz",
          content: "Last message received",
          senderId: "1234",
          username: "John Doe",
          timestamp: "10:20",
          saved: true,
          distributed: true,
          seen: true,
          new: false,
        },
      },
    ]);

    const messages = ref([]);
    const messagesLoaded = ref(false);

    const fetchMessages = ({ options = {} }) => {
      setTimeout(() => {
        if (options.reset) {
          messages.value = addMessages(true);
        } else {
          messages.value = [...addMessages(), ...messages.value];
          messagesLoaded.value = true;
        }
      });
    };

    const addMessages = (reset) => {
      const messages = [];

      for (let i = 0; i < 30; i++) {
        messages.push({
          _id: reset ? i : messages.length + i,
          content: `${reset ? "" : "paginated"} message ${i + 1}`,
          senderId: "4321",
          username: "John Doe",
          date: "13 November",
          timestamp: "10:20",
          deleted: false,
          // files: [
          //   {
          //     name: "My File",
          //     size: 67351,
          //     type: "png",
          //     url: "https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj",
          //   },
          // ],
          // reactions: {
          //   "😁": [
          //     "1234", // USER_ID
          //   ],
          //   "🥰": ["1234"],
          // },
          // replyMessage: {
          //   content: "Reply Message",
          //   senderId: "4321",
          // files: [
          //   {
          //     name: "My Replied File",
          //     size: 67351,
          //     type: "png",
          //     audio: true,
          //     duration: 14.4,
          //     url: "https://firebasestorage.googleapis.com/...",
          //     preview: "data:image/png;base64,iVBORw0KGgoAA...",
          //   },
          // ],
          // },
        });
      }

      return messages;
    };

    const sendMessage = (message) => {
      messages.value = [
        ...messages.value,
        {
          _id: messages.value.length,
          content: message.content,
          senderId: currentUserId.value,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString(),
          distributed: true,
          seen: false,
          deleted: false,
          // files: [
          //   {
          //     name: "My File",
          //     size: 67351,
          //     type: "png",
          //     url: "https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj",
          //   },
          // ],
        },
      ];
    };

    const addNewMessage = () => {
      setTimeout(() => {
        messages.value = [
          ...messages.value,
          {
            _id: messages.value.length,
            content: "NEW MESSAGE",
            senderId: "1234",
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString(),
          },
        ];
      }, 2000);
    };

    return {
      currentUserId,
      rooms,
      messages,
      messagesLoaded,
      fetchMessages,
      addMessages,
      sendMessage,
      addNewMessage,
    };
  },
});
</script>

<style lang="scss">
body {
  font-family: "Quicksand", sans-serif;
}
</style>
