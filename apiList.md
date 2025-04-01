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

/feed?page=1&limit=10 => 1 - 10 => skip(0) & .limit(10)
/feed?page=2&limit=10 => 11 - 20 => skip(10) & .limit(10)
/feed?page=3&limit=10 => 21 - 30 => skip(20) & .limit(10)
