FROM ror-manual-search:production

ENV FESS_VERSION=10.3.1
ENV TZ JST-9

# patch
COPY tmp/ /opt/fess/

WORKDIR /opt/fess

ENTRYPOINT [ "/opt/fess/bin/fess" ]
CMD [ "/opt/fess/bin/fess" ]

EXPOSE 8080 9201 9301
