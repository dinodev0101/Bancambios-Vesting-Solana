FROM node:12.20.1-alpine AS build
ENV HOME /opt/srm-vesting-fe

ARG APP_ENV_ARG
ENV APP_ENV $APP_ENV_ARG
ARG APP_BUILD_ENV_ARG
ENV APP_BUILD_ENV $APP_BUILD_ENV_ARG

WORKDIR $HOME
COPY . $HOME/

RUN set -x && \
    apk add --no-cache --virtual \
    .gyp \
    git \
    rsync \
    python \
    autoconf \
    automake \
    make \
    g++ \
    zlib-dev \
    nasm

# # yarn install
# RUN set -x && \
#     yarn install && \
    # yarn prebuild && \
    # yarn postbuild && \
#     yarn --version

# yarn build
RUN set -x && \
    # cp $HOME/.env.$ENV_FILE $HOME/.env && \
    # cat $HOME/.env && \
    mkdir -p $HOME/srm-vesting-fe && \
    sleep 10000
    # yarn $APP_BUILD && \
    # ls -la $HOME/build

FROM nginx:1.17

WORKDIR $HOME
COPY .build $HOME/.build
COPY --from=build /opt/srm-vesting-fe/build $HOME/build

# RUN set -x && \
#     rm -rf /etc/nginx/conf.d/default.conf && \
#     cp $HOME/.build/.nginx/vesting-bx-app-develop.conf /etc/nginx/conf.d/vesting-bx-app-develop.conf && \
#     nginx -t && \
#     ls -la $HOME/build

STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
