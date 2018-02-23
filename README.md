This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

#The Word Is...

This is a project-in-motion. It takes some watson-enabled speech recognition and pairs it with random words for arbitrary game-age. Also, it probably indirectly makes comments towards the limit's of technologies ability to interface with meatspace but whatever.

##Notes

To get this running you'll have to 'npm install' in both the root and client directories. Also, you should make an .env file with the following information. You can figure out how to obtain it yourself:

SPEECH_TO_TEXT_USERNAME=[OBTAINED_WHILE_SIGNING_UP_FOR_IBMS_WATSON_SERVICE]
SPEECH_TO_TEXT_PASSWORD=[OBTAINED_WHILE_SIGNING_UP_FOR_IBMS_WATSON_SERVICE]
PORT=3002
SERVER_ROOT=//localhost:3002

Start the server (root) first and then start yer client.