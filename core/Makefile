DOCKER_COMPOSE = docker compose -f compose.test.yaml

.PHONY: build test coverage sh down

build:
	$(DOCKER_COMPOSE) build

test:
	$(DOCKER_COMPOSE) run --rm test-runner

coverage:
	$(DOCKER_COMPOSE) run --rm --entrypoint "php -d pcov.enabled=1 -d memory_limit=512M vendor/bin/phpunit" test-runner --coverage-html coverage/

phpstan:
	$(DOCKER_COMPOSE) run --rm --entrypoint vendor/bin/phpstan test-runner analyse --memory-limit=1G

psalm:
	$(DOCKER_COMPOSE) run --rm --entrypoint vendor/bin/psalm test-runner --memory-limit=1G

deptrac:
	$(DOCKER_COMPOSE) run --rm --entrypoint vendor/bin/deptrac test-runner analyse

cs-fix:
	$(DOCKER_COMPOSE) run --rm --entrypoint vendor/bin/php-cs-fixer test-runner fix

qa: phpstan psalm deptrac test

sh:
	$(DOCKER_COMPOSE) run --rm --entrypoint bash test-runner

down:
	$(DOCKER_COMPOSE) down --remove-orphans
