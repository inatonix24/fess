#!/bin/bash

ret=0
while [ $ret ]
do
  echo check response
  curl http://localhost 2>&1 | grep "Connection refused"
  ret=$?
  sleep 0.5
  # curl -LI http://localhost -o /dev/null -w '%{http_code}\n' -s
  # code=`curl -LI http://localhost -o /dev/null -w '%{http_code}\n' -s`
  # echo response code = $code
done
