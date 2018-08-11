FROM tiangolo/nginx-rtmp
COPY nginx.conf /etc/nginx/nginx.conf
COPY rtmp.conf /etc/nginx/rtmp.conf
RUN mkdir /etc/nginx/rtmp.conf.d/

EXPOSE 80
EXPOSE 1935
CMD ["nginx", "-g", "daemon off;"]

#FROM python:3
#ENV PYTHONUNBUFFERED 1
#RUN mkdir /opt/streampush
#WORKDIR /app
#ADD requirements.txt /opt/streampush/
#RUN pip install -r requirements.txt
#ADD . /opt/streampush/
