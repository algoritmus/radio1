docker build -t radio1_web:stack ./radio1_web/app_web
docker build -t radio1_scraper:stack ./radio1_scraper/app
docker stack deploy -c stack.yml radio1
