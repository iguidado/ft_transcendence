ARG STACK_VERSION

FROM docker.elastic.co/elasticsearch/elasticsearch:${STACK_VERSION}

COPY ./entrypoint.sh /root/entrypoint.sh

#RUN chmod +x /root/entrypoint.sh

CMD /root/entrypoint.sh
