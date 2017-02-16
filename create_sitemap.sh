#!/bin/sh
docker run -it --rm -v /root/fess:/usr/src/myapp -v /root/share:/var -w /usr/src/myapp ruby ruby create_sitemap.rb $1
