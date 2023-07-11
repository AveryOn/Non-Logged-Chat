// Обновляет черновик в localStorage
function draftStorageUpdate(chatID, messageText, replyMessage, isForwardMessages, forwardedMessages) {
    chatID + '';
    let draft = JSON.parse(localStorage.getItem('draft'));
    if (!draft) {
        localStorage.setItem('draft', JSON.stringify({}));
        return draftStorageUpdate(chatID, messageText, replyMessage, isForwardMessages, forwardedMessages);
    }
    // Если ранее не было записано этого чата в черновик, то он записывается
    if (chatID && !draft[chatID]) {
        draft[chatID] = {
            messageText: null,
            replyMessage: { replyToID: null, replyToContent: null },
            isForwardMessages: false,
            forwardedMessages: [],
        }
        localStorage.setItem('draft', JSON.stringify(draft));
    }
    if (chatID && draft[chatID]) {
        if (messageText) {
            draft[chatID].messageText = messageText;
        } else if (messageText === 0) draft[chatID].messageText = null;

        if (replyMessage && replyMessage.replyToID) {
            draft[chatID].replyMessage.replyToID = replyMessage.replyToID;
        } else if (replyMessage === 0) {
            draft[chatID].replyMessage = {}
            draft[chatID].replyMessage.replyToID = null;
            draft[chatID].replyMessage.replyToContent = null;
        }

        if (replyMessage && replyMessage.replyToContent) {
            draft[chatID].replyMessage.replyToContent = replyMessage.replyToContent;
        } else if (replyMessage === 0) {
            draft[chatID].replyMessage = {}
            draft[chatID].replyMessage.replyToContent = null;
            draft[chatID].replyMessage.replyToID = null;
        }

        if (isForwardMessages === true || isForwardMessages === false) {
            draft[chatID].isForwardMessages = isForwardMessages;
        } else if (isForwardMessages === 0) draft[chatID].isForwardMessages = false;

        if (forwardedMessages && forwardedMessages.length) {
            draft[chatID].forwardedMessages = forwardedMessages;
        } else if (forwardedMessages === 0) draft[chatID].forwardedMessages = [];

        localStorage.setItem('draft', JSON.stringify(draft));
    }
}

export {
    draftStorageUpdate
}