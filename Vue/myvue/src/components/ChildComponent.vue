<template>
  <div>
    <h2>Child Component</h2>
    <p>Message from parent: {{ receivedMessage }}</p>
    <input v-model="childMessage" placeholder="Send message to parent" />
    <button @click="sendMessageToParent">Send to Parent</button>
  </div>
</template>

<script>
import { ref, defineExpose } from 'vue';

export default {
  name: 'ChildComponent',
  emits: ['message-from-child'],
  setup(_, { emit }) {
    const receivedMessage = ref('');
    const childMessage = ref('');

    const sendMessageToParent = () => {
      emit('message-from-child', childMessage.value);
    };

    const receiveMessage = (message) => {
      receivedMessage.value = message;
    };

    defineExpose({ receiveMessage });

    return {
      receivedMessage,
      childMessage,
      sendMessageToParent,
    };
  },
};
</script>
