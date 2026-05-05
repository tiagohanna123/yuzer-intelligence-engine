.PHONY: test typecheck build coverage clean lint dev all

test:
	npx vitest run

typecheck:
	npx tsc --noEmit

build:
	npm run build

coverage:
	npm run test:coverage

clean:
	rm -rf dist coverage

lint:
	npm run lint

dev:
	npx vitest watch

all: typecheck test build
