function requestGPTApi(text) {
  const apiURL = 'https://api.openai.com/v1/completions';
  const params = {
    'headers': {'Authorization': 'Bearer ' + ScriptProperties.getProperty('OPENAI_KEY')},
    "muteHttpExceptions": true,
    'payload': JSON.stringify({"model": "text-davinci-003","prompt": text ,"max_tokens": 400}),  
    'contentType': 'application/json',
    'method': 'post',
  };
  const response = UrlFetchApp.fetch(apiURL, params);
  const data = response.getContentText();
  const json = JSON.parse(data);
  return json.choices[0].text
}

function doGet(e){
  return "WebHook 部屬測試成功";
}

function doPost(e) {
  const apiUrl = 'https://api.line.me/v2/bot/message/reply';
  const eventData = JSON.parse(e.postData.contents).events[0];
  const replyToken = eventData.replyToken;
  const messageText = eventData.message.text;
  const messageType = eventData.message.type;
  
  let replyMessage = requestGPTApi(messageText);
  replyMessage = replyMessage.slice(2).replace('\n\n\n','\n\n');

  const payload = {
    'replyToken': replyToken,
    'messages': [{
        'type': 'text',
        'text': replyMessage
      }]
  };

  const options = {
    'payload' : JSON.stringify(payload),
    'method'  : 'POST',
    'headers' : {"Authorization" : "Bearer " + ScriptProperties.getProperty('LINE_ACCESS_TOKEN')},
    'contentType' : 'application/json'
  };

  // 呼叫 API 並傳送資料
  UrlFetchApp.fetch(apiUrl, options);
}