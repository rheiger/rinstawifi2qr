IMAGE ?= rinstawifi2qr
TAG ?= latest
HOST_PORT ?= 3000

.PHONY: install build docker-build docker-run compose-up compose-down clean

install:
	@npm install

build:
	@npm run build

docker-build:
	@docker build -t $(IMAGE):$(TAG) .

docker-run:
	@docker run --rm -p $(HOST_PORT):80 $(IMAGE):$(TAG)

compose-up:
	@docker-compose --env-file env.prod.example up -d --build

compose-down:
	@docker-compose down

clean:
	@rm -rf node_modules dist
