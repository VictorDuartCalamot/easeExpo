import { Platform } from "react-native";

const ChatViewAdmin = Platform.select({
    web: () => require('./web/chat-view.admin-web').default,
    default: () => require('./movil/chat-view.admin-movil').default,
})();

export default ChatViewAdmin;