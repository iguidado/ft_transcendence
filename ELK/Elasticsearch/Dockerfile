ARG STACK_VERSION

FROM docker.elastic.co/elasticsearch/elasticsearch:${STACK_VERSION}

COPY ./setup.sh /root/setup.sh

#RUN chmod +x /root/setup.sh

CMD /root/setup.sh
