Dev Tinder API

AUTH ROUTER:  
- POST/signup
- POST/login
- POST/logout

PROFILE ROUTER: 
- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password

STATUS: ignored, interested, accepted, rejected

CONNECTION REQUEST ROUTER: 
- POST/request/send/interested/:userId
- POST/request/send/ignored/:userId

- POST/request/review/accepted/:requestId
- POST/request/review/rejected/:requestId

- GET/connections
- GET/request/recieved
- GET/feed - Gets you 