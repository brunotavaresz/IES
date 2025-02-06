FROM python:3.11

WORKDIR /

COPY . .

RUN pip install -r requirements.txt
RUN chmod a+x run.sh
CMD [ "./run.sh"]