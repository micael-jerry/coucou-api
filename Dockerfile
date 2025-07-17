FROM node:20.16.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN \
			if [ -f yarn.lock ]; then yarn --frozen-lockfile \
			else echo "yarn.lock not found." && exit 1; \
			fi

COPY . .

RUN yarn prisma generate && yarn build

EXPOSE 8080

CMD [ "yarn", "start:migrate:prod" ]
