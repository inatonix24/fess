#!/bin/bash

code=400
while [ "$code" -ge "400" ]
do
  echo check response
  code=`curl -LI http://localhost -o /dev/null -w '%{http_code}\n' -s`
  echo response code = $code
  sleep 0.5
done
