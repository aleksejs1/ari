DOCKER_COMPOSE = docker compose -f compose.test.yaml

.PHONY: build test coverage sh down deptrac deptrac-strict

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

# Like 'deptrac' but also fails if any source file is not assigned to a layer.
# Run periodically to catch files that drift outside the defined architecture.
# Not part of 'make qa' because it requires all new namespaces to be registered
# in deptrac.yaml before they are introduced.
deptrac-strict:
	$(DOCKER_COMPOSE) run --rm --entrypoint vendor/bin/deptrac test-runner analyse --fail-on-uncovered

cs-fix:
	$(DOCKER_COMPOSE) run --rm --entrypoint vendor/bin/php-cs-fixer test-runner fix

qa: phpstan psalm deptrac test

sh:
	$(DOCKER_COMPOSE) run --rm --entrypoint bash test-runner

down:
	$(DOCKER_COMPOSE) down --remove-orphans
