Documents
=========

# User Session

Key         |Value                     
-|-
login       |true if they are logged in
verified    |true if their mail is verified
verificationValue| present only if `verified` is false
email       |email address of user
status      |{root,admin,user}
userId      |user id from db


# Context Variables

|Variables|Value|
|----------|---|
|login| Boolean|
|email| string|
|status| {root,admin,user}|
|superUser| true if not user|

# Docker
docker run -itd --name cpps_app -v $PWD:/home/src -p 8000:8002 --expose 3000 -p 3000:3000 cpps /bin/bash
