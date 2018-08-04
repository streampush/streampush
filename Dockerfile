FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /opt/streampush
WORKDIR /app
ADD requirements.txt /opt/streampush/
RUN pip install -r requirements.txt
ADD . /opt/streampush/
