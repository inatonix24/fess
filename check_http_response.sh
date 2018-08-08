#!/bin/bash

check=true
while [ $check ]
do
  echo check response
  check=`curl http://localhost 2>&1 | grep "Connection refused"`
  echo $check
  # curl -LI http://localhost -o /dev/null -w '%{http_code}\n' -s
  # code=`curl -LI http://localhost -o /dev/null -w '%{http_code}\n' -s`
  # echo response code = $code
  sleep 0.5
done
