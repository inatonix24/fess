#!/bin/bash
ret=0
while [ $ret = 0 ]
do
  echo check response
  curl http://localhost 2>&1 | grep "Connection refused"
  ret=$?
  echo $ret
  sleep 0.5
done