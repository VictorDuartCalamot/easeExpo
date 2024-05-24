import { Platform } from "react-native";

const ChatViewClient = Platform.select({
    web: () => require('./web/chat-view.client-web').default,
    default: () => require('./movil/chat-view.client-movil').default,
})();

export default ChatViewClient;