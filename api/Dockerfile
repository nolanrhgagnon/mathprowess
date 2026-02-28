FROM python:3.13-slim-bullseye

RUN pip install pipenv

WORKDIR /app

COPY Pipfile* ./

RUN pip install --upgrade pip
RUN pipenv install --system --deploy --ignore-pipfile

COPY . .

RUN chmod +x entrypoint.sh
RUN rm -Rf media
RUN mkdir django_static
RUN mkdir media

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
